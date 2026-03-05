/**
 * @file page.tsx
 * @description 呼吁和平、停止对伊朗侵略的页面。包含从 Google News RSS 获取实时新闻的轮播功能。
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface NewsItem {
  time: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export default function PeacePage() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      time: "正在加载...",
      title: "正在获取最新实时新闻，请稍候...",
      description: "新闻数据加载中...",
      link: "#",
      imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop"
    }
  ]);

  // 客户端获取实时新闻（通过 rss2json 代理 Google News RSS）
  useEffect(() => {
    const fetchRealTimeNews = async () => {
      try {
        // 使用 Google News 关于“伊朗 美国 以色列”的中文 RSS 源
        const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=伊朗+美国+以色列&hl=zh-CN&gl=CN&ceid=CN:zh-Hans');
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          // 按照新闻发生时间倒序排序
          const sortedItems = data.items.sort((a: any, b: any) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
          });

          const items = sortedItems.slice(0, 6).map((item: any, index: number) => {
            // 计算距离现在的时间
            const pubDate = new Date(item.pubDate);
            const now = new Date();
            const diffHours = Math.round((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const timeLabel = diffHours === 0 ? "刚刚" : `${diffHours} 小时前`;

            // 提取或生成简单的描述 (RSS返回的description往往包含复杂HTML，我们做一个简单剥离)
            let desc = item.description || "";
            // 去除HTML标签
            desc = desc.replace(/<[^>]+>/g, '');
            // 截断描述以保证排版
            if (desc.length > 150) {
              desc = desc.substring(0, 150) + '...';
            }

            // 尝试从新闻内容或返回字段中获取图片，如果找不到则使用默认相关图片
            let image = item.thumbnail || item.enclosure?.link;
            if (!image) {
              // 6张专门准备的国际局势/新闻占位图，根据索引按顺序分配，保证6条新闻图片不重复
              const placeholders = [
                "https://images.unsplash.com/photo-1541888046425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop", // 建筑/新闻/国际
                "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop", // 经济/全球/影响
                "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop", // 报纸/媒体
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop", // 团队/发布会
                "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=2070&auto=format&fit=crop", // 会议/庄重
                "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2069&auto=format&fit=crop"  // 印刷品/重大新闻
              ];
              image = placeholders[index % placeholders.length];
            }

            return {
              time: timeLabel,
              title: item.title.replace(/ - [^-]+$/, ''), // 移除新闻来源后缀
              description: desc || "点击标题阅读详细新闻内容以了解最新局势发展。",
              link: item.link,
              imageUrl: image
            };
          });
          setNewsItems(items);
        }
      } catch (error) {
        console.error('获取新闻失败:', error);
        setNewsItems([
          {
            time: "更新失败",
            title: "无法获取最新新闻，请检查网络连接。",
            description: "请稍后刷新页面重试。",
            link: "#",
            imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop"
          }
        ]);
      }
    };

    fetchRealTimeNews();
  }, []);

  // 轮播定时器
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 5000); // 每 5 秒切换一次

    return () => clearInterval(timer);
  }, [newsItems.length]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-900 selection:text-white">
      {/* 头部 / 英雄区 */}
      <header className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop" 
            alt="和平鸽" 
            fill
            className="object-cover opacity-30"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            坚守和平 <br className="hidden md:block"/> 停止侵略
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 font-light">
            我们呼吁以理性和外交取代战火与毁灭。
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 grid gap-16">
        
        {/* 核心诉求区 */}
        <section className="grid md:grid-cols-2 gap-10">
          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              停止军事侵略
            </h2>
            <p className="leading-relaxed text-neutral-400">
              我们强烈呼吁美国和以色列立即停止对伊朗的军事打击行动。暴力只会滋生更多的仇恨与暴力，战争的升级必将导致整个中东地区陷入灾难性的动荡。
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
              捍卫国家主权
            </h2>
            <p className="leading-relaxed text-neutral-400">
              我们与伊朗人民站在一起。任何国家都拥有保卫其国家主权和领土完整的神圣权利。一个国家的未来应当由其本国人民决定，而非受制于外部势力的轰炸与干涉。
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              减少战事与伤亡
            </h2>
            <p className="leading-relaxed text-neutral-400">
              冤冤相报何时了。我们恳切希望各方立即降级冲突，以防止更多无辜生命的消逝。平民的伤亡已经令人痛心，人类社会无法再承受一场范围更广的战争。
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              期盼世界和平
            </h2>
            <p className="leading-relaxed text-neutral-400">
              我们的终极愿景是实现持久的世界和平。我们敦促国际社会和各国领导人将对话、相互尊重以及和平解决争端置于首位。只有和平，才是人类唯一的胜利。
            </p>
          </div>
        </section>

        {/* 实时新闻轮播 */}
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">最近 48 小时实时新闻</h2>
          <div className="relative w-full max-w-5xl mx-auto bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl h-[450px] md:h-[400px] flex items-center justify-center">
            {newsItems.map((news, index) => (
              <div 
                key={index}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex flex-col md:flex-row ${
                  index === currentNewsIndex 
                    ? 'opacity-100 z-10' 
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* 新闻图片区域 */}
                <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                  <Image 
                    src={news.imageUrl} 
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-[10000ms] ease-linear hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-900 via-transparent to-transparent"></div>
                </div>

                {/* 新闻内容区域 */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-neutral-900">
                  <div className="mb-4 flex items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full inline-block">
                      {news.time}
                    </span>
                  </div>
                  
                  <a href={news.link} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="text-xl md:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-amber-400 transition-colors line-clamp-3">
                      {news.title}
                    </h3>
                  </a>
                  
                  <p className="text-neutral-400 leading-relaxed line-clamp-4 md:line-clamp-5 mb-6 text-sm md:text-base">
                    {news.description}
                  </p>

                  <a 
                    href={news.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-amber-400 transition-colors w-max"
                  >
                    阅读全文 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                </div>
              </div>
            ))}

            {/* 轮播指示器 */}
            {newsItems.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentNewsIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentNewsIndex ? 'bg-amber-500 w-8' : 'bg-neutral-600 w-2 hover:bg-neutral-400'
                    }`}
                    aria-label={`跳转到新闻 ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="text-center py-10 border-t border-neutral-800 mt-12 text-neutral-500 text-sm">
        <p>为呼唤和平与人道主义而建。愿世界再无战火。</p>
      </footer>
    </div>
  );
}
