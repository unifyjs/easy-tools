import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { toolCategories, getAllTools } from '@/data/tools';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Home, Wrench, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['all', ...toolCategories.map(cat => cat.id)])
  );
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  
  const handleToolSelect = (toolId: string) => {
    navigate(`/tools/${toolId}`);
  };

  const isHomePage = location.pathname === '/';
  const currentToolId = location.pathname.replace('/tools/', '');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Easy Tools
                </h1>
                <p className="text-xs text-gray-500">开发者工具集合</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="bg-white/50 backdrop-blur-sm hide-scrollbar">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 font-medium">导航</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('/')}
                      isActive={isHomePage}
                      className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                    >
                      <Home className="w-4 h-4" />
                      <span>首页</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 font-medium">工具分类</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolCategories.map((category) => (
                    <div key={category.id}>
                      {/* 一级菜单 - 工具分类 */}
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => toggleCategory(category.id)}
                          className="hover:bg-blue-50 font-medium"
                        >
                          <div dangerouslySetInnerHTML={{ __html: category.icon }} />
                          <span>{category.name}</span>
                          <div className="ml-auto flex items-center gap-2">
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      {/* 二级菜单 - 具体工具 */}
                      {expandedCategories.has(category.id) && (
                        <div className="ml-6 space-y-1">
                          {category.tools.map((tool) => (
                            <SidebarMenuItem key={tool.id}>
                              <SidebarMenuButton
                                onClick={() => handleToolSelect(tool.id)}
                                isActive={currentToolId === tool.id}
                                className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 text-sm pl-2"
                              >
                                <span>{tool.name}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索工具..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;