import React, { useState, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Search, Sparkles } from 'lucide-react';
import { aiToolCategories, getAllAITools, searchAITools, type AITool } from '@/data/aiTools';

const AIToolNavigator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    if (searchQuery.trim()) {
      return searchAITools(searchQuery);
    }
    
    if (selectedCategory === 'all') {
      return getAllAITools();
    }
    
    const category = aiToolCategories.find(cat => cat.id === selectedCategory);
    return category ? category.tools : [];
  }, [searchQuery, selectedCategory]);

  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const ToolCard: React.FC<{ tool: AITool }> = ({ tool }) => (
    <Card 
    onClick={() => handleToolClick(tool.url)}
    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {/* <Button 
          onClick={() => handleToolClick(tool.url)}
          className="w-full"
          size="sm"
        >
          访问工具
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button> */}
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEOHead toolId="ai-tool-navigator" />
      <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI工具导航
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          汇集1000+国内外AI工具，涵盖写作、图像、视频、办公、聊天等各个领域，助力提升工作效率
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="搜索AI工具..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
          <TabsTrigger value="all" className="text-xs">
            全部
          </TabsTrigger>
          {aiToolCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              <span className="mr-1">{category.icon}</span>
              <span className="hidden sm:inline">{category.name.replace('AI', '')}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </TabsContent>

        {aiToolCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </h2>
              <p className="text-muted-foreground mt-1">
                共 {category.tools.length} 个工具
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            搜索结果 ({filteredTools.length})
          </h2>
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">未找到相关工具，请尝试其他关键词</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {/* <div className="mt-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{getAllAITools().length}+</div>
            <div className="text-sm text-muted-foreground">AI工具</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{aiToolCategories.length}</div>
            <div className="text-sm text-muted-foreground">工具分类</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">每日</div>
            <div className="text-sm text-muted-foreground">更新</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">免费</div>
            <div className="text-sm text-muted-foreground">使用</div>
          </div>
        </div>
      </div> */}
    </div>
    </>
  );
};

export default AIToolNavigator;