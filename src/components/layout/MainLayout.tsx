import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeSwitcher, { Theme } from './ThemeSwitcher';
import MobileHeader from './MobileHeader';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  theme, 
  setTheme, 
  sidebarOpen, 
  setSidebarOpen, 
  activeCategory, 
  setActiveCategory,
  activeTool,
  setActiveTool,
  pageTitle = "英文字母大小写转换"
}) => {
  // 主题切换
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* 主题切换器 */}
      <ThemeSwitcher theme={theme} setTheme={setTheme} />

      <div className="flex h-screen">
        {/* 侧边栏 */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* 移动端顶部栏 */}
          <MobileHeader 
            setSidebarOpen={setSidebarOpen} 
            title={pageTitle} 
          />

          {/* 主要内容 */}
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;