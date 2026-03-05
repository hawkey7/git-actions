import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "坚守和平 停止侵略",
  description: "呼吁和平、停止对伊朗侵略的页面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
