import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toolCategories, getAllTools, type Tool } from '@/data/tools';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const allTools = getAllTools();
  const navigate = useNavigate();
  
  const handleToolSelect = (toolId: string) => {
    navigate(`/tools/${toolId}`);
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

  return (
    <>
      <SEOHead toolId="home" />
      <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedCategory === 'all' ? '所有工具' : 
            toolCategories.find(cat => cat.id === selectedCategory)?.name}
        </h2>
        <p className="text-gray-600">
          {selectedCategory === 'all' 
            ? `发现 ${allTools.length} 个实用的开发工具，提高您的工作效率，包含新增AI工具导航`
            : `${filteredTools.length} 个${toolCategories.find(cat => cat.id === selectedCategory)?.name}工具`
          }
        </p>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索工具..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-200 bg-white/80 backdrop-blur-sm cursor-pointer"
            onClick={() => handleToolSelect(tool.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                    <div dangerouslySetInnerHTML={{ __html: tool.icon }} />
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
    </>
  );
};

export default Home;