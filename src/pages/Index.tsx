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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toolCategories, getAllTools, type Tool, type ToolCategory } from '@/data/tools';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Home, Wrench, ChevronDown, ChevronRight } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));
  
  const allTools = getAllTools();
  
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  
  const handleToolSelect = (toolId: string, categoryId: string) => {
    setSelectedTool(toolId);
    setSelectedCategory(categoryId);
  };
  
  const filteredTools = React.useMemo(() => {
    let tools = selectedCategory === 'all' ? allTools : 
      toolCategories.find(cat => cat.id === selectedCategory)?.tools || [];
    
    if (searchTerm) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return tools;
  }, [selectedCategory, searchTerm, allTools]);
  
  const selectedToolData = React.useMemo(() => {
    if (!selectedTool) return null;
    return allTools.find(tool => tool.id === selectedTool);
  }, [selectedTool, allTools]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className=" border-gray-200 bg-white/80 backdrop-blur-sm">
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
                      onClick={() => setSelectedCategory('all')}
                      isActive={selectedCategory === 'all'}
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
                          <svg width="18" height="18" viewBox="0 0 48 48" class="text-orange-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7H16C20.4183 7 24 10.5817 24 15V42C24 38.6863 21.3137 36 18 36H5V7Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="bevel"></path><path d="M43 7H32C27.5817 7 24 10.5817 24 15V42C24 38.6863 26.6863 36 30 36H43V7Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="bevel"></path></svg>
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
                                onClick={() => handleToolSelect(tool.id, category.id)}
                                isActive={selectedTool === tool.id}
                                className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 text-sm pl-2"
                              >
                                <span className="text-base">{tool.icon}</span>
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
          
          <main className="flex-1 p-6">
            {selectedToolData ? (
              // 显示选中工具的详细信息
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => setSelectedTool('')}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                      ← 返回列表
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                      <span className="text-3xl">{selectedToolData.icon}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedToolData.name}</h1>
                      <p className="text-gray-600 text-lg">{selectedToolData.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-6">
                    {toolCategories.find(cat => cat.id === selectedToolData.category)?.name}
                  </Badge>
                </div>
                
                {/* 工具功能区域 */}
                <Card className="p-8">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">工具功能开发中</h3>
                    <p className="text-gray-600">该工具的具体功能正在开发中，敬请期待。</p>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      即将推出
                    </button>
                  </div>
                </Card>
              </div>
            ) : (
              // 显示工具列表
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory === 'all' ? '所有工具' : 
                      toolCategories.find(cat => cat.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedCategory === 'all' 
                      ? `发现 ${allTools.length} 个实用的开发工具，提高您的工作效率`
                      : `${filteredTools.length} 个${toolCategories.find(cat => cat.id === selectedCategory)?.name}工具`
                    }
                  </p>
                </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-200 bg-white/80 backdrop-blur-sm cursor-pointer"
                  onClick={() => handleToolSelect(tool.id, tool.category)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                          <span className="text-lg">{tool.icon}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {tool.name}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {toolCategories.find(cat => cat.id === tool.category)?.name}
                      </Badge>
                      <span className="text-sm text-blue-600 font-medium">
                        点击查看 →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
                {filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关工具</h3>
                    <p className="text-gray-600">尝试调整搜索关键词或选择其他分类</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
