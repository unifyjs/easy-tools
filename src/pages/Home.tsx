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
      
      {/* 测试内容 - 用于验证回到顶部功能 */}
      <div className="mt-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>关于 Easy Tools</CardTitle>
            <CardDescription>一个强大的开发者工具集合</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Easy Tools 是一个专为开发者设计的在线工具集合，提供了丰富的功能来提高您的工作效率。
              无论您是前端开发者、后端开发者还是全栈开发者，这里都有适合您的工具。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">编码解码工具</h4>
                <p className="text-sm text-gray-600">
                  支持 Base64、URL、HTML、Unicode 等多种编码格式，还包括 MD5、SHA 等哈希算法。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">代码工具</h4>
                <p className="text-sm text-gray-600">
                  JSON 格式化、代码美化、SQL 格式化等，让您的代码更加整洁易读。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">文本处理</h4>
                <p className="text-sm text-gray-600">
                  文本格式化、Markdown 编辑器、正则表达式测试等实用功能。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">转换工具</h4>
                <p className="text-sm text-gray-600">
                  单位转换、颜色转换、时间戳转换等，满足您的各种转换需求。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>特色功能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">即时预览</h4>
                  <p className="text-sm text-gray-600">所有工具都支持实时预览，输入即可看到结果。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">一键复制</h4>
                  <p className="text-sm text-gray-600">支持一键复制结果到剪贴板，提高工作效率。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">响应式设计</h4>
                  <p className="text-sm text-gray-600">完美适配桌面和移动设备，随时随地使用。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">数据安全</h4>
                  <p className="text-sm text-gray-600">所有处理都在本地进行，不会上传您的数据。</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>使用指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. 选择工具</h4>
                <p className="text-sm text-gray-600">从左侧导航栏中选择您需要的工具分类，然后点击具体的工具。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. 输入数据</h4>
                <p className="text-sm text-gray-600">在输入框中输入您要处理的数据，系统会实时显示处理结果。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. 复制结果</h4>
                <p className="text-sm text-gray-600">点击“复制”按钮将结果复制到剪贴板，然后在您的项目中使用。</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>常见问题</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Q: 数据会被上传到服务器吗？</h4>
                <p className="text-sm text-gray-600">A: 不会。所有的数据处理都在您的浏览器本地进行，保证数据安全。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Q: 支持哪些浏览器？</h4>
                <p className="text-sm text-gray-600">A: 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Q: 可以离线使用吗？</h4>
                <p className="text-sm text-gray-600">A: 大部分功能可以离线使用，但首次访问需要网络连接来加载资源。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Home;