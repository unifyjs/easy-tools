import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getToolComponent, getToolInfo } from '@/components/tools/ToolManager';
import { Theme } from '@/components/layout/ThemeSwitcher';

export default function Index() {
  const [theme, setTheme] = useState<Theme>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('text');
  const [activeTool, setActiveTool] = useState('case-converter');

  // 获取当前工具组件
  const CurrentToolComponent = getToolComponent(activeTool);
  const currentToolInfo = getToolInfo(activeTool);

  return (
    <MainLayout 
      theme={theme}
      setTheme={setTheme}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      pageTitle={currentToolInfo?.name || "工具"}
    >
      {CurrentToolComponent ? <CurrentToolComponent /> : <div>工具不存在或正在开发中</div>}
    </MainLayout>
  );
}