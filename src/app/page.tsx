/**
 * @file page.tsx
 * @description 主页组件，渲染一个居中的 Hello World
 */

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-white">
        Hello World
      </h1>
    </div>
  );
}
