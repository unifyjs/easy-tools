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
import { Search, Home, Wrench } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const allTools = getAllTools();
  
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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
          
          <SidebarContent className="bg-white/50 backdrop-blur-sm">
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
                      <Badge variant="secondary" className="ml-auto">
                        {allTools.length}
                      </Badge>
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
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton
                        onClick={() => setSelectedCategory(category.id)}
                        isActive={selectedCategory === category.id}
                        className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {category.tools.length}
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
            </div>
          </header>
          
          <main className="flex-1 p-6">
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
                <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
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
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        使用工具 →
                      </button>
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
