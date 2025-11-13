import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, ArrowLeft, ThumbsUp, Eye, CheckCircle, XCircle, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JsonEditor = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [compressedJson, setCompressedJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('format');
  const { toast } = useToast();

  const validateAndProcess = (jsonText: string) => {
    if (!jsonText.trim()) {
      setIsValid(null);
      setErrorMessage('');
      setFormattedJson('');
      setCompressedJson('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      setIsValid(true);
      setErrorMessage('');
      
      // 格式化JSON
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      
      // 压缩JSON
      const compressed = JSON.stringify(parsed);
      setCompressedJson(compressed);
      
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
      setFormattedJson('');
      setCompressedJson('');
    }
  };

  const handleInputChange = (value: string) => {
    setInputJson(value);
    validateAndProcess(value);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制内容",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputJson('');
    setFormattedJson('');
    setCompressedJson('');
    setIsValid(null);
    setErrorMessage('');
  };

  const downloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleInputChange(content);
      };
      reader.readAsText(file);
    }
  };

  const loadExample = (example: string) => {
    const examples = {
      simple: `{
  "name": "张三",
  "age": 25,
  "city": "北京"
}`,
      complex: `{
  "users": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "profile": {
        "age": 25,
        "city": "北京",
        "hobbies": ["读书", "旅行", "编程"]
      },
      "active": true
    },
    {
      "id": 2,
      "name": "李四",
      "email": "lisi@example.com",
      "profile": {
        "age": 30,
        "city": "上海",
        "hobbies": ["音乐", "运动"]
      },
      "active": false
    }
  ],
  "total": 2,
  "timestamp": "2025-11-13T06:00:00Z"
}`,
      api: `{
  "status": "success",
  "code": 200,
  "message": "请求成功",
  "data": {
    "list": [
      {
        "id": "001",
        "title": "易用工具",
        "description": "便捷的在线工具网站",
        "tags": ["工具", "在线", "免费"],
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-11-13T06:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 1
    }
  }
}`
    };
    handleInputChange(examples[example as keyof typeof examples] || '');
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  蛙
                </div>
                <h1 className="text-xl font-bold text-gray-900">易用工具</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 工具标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 JSON编辑器</h1>
          <p className="text-gray-600">
            在线JSON格式化、压缩、验证工具，支持语法高亮和错误提示
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              150万次使用
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              2200个赞
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  JSON输入
                  {isValid === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {isValid === false && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="json-upload"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => document.getElementById('json-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    上传
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={clearAll}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    清空
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="请输入JSON数据..."
                value={inputJson}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[400px] resize-none font-mono text-sm"
              />
              {errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  <strong>JSON格式错误：</strong> {errorMessage}
                </div>
              )}
              {isValid === true && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-600">
                  <strong>✓ JSON格式正确</strong>
                </div>
              )}
              <div className="mt-3 text-sm text-gray-500">
                字符数: {inputJson.length}
              </div>
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">处理结果</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="format">格式化</TabsTrigger>
                  <TabsTrigger value="compress">压缩</TabsTrigger>
                </TabsList>
                
                <TabsContent value="format" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">格式化JSON</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(formattedJson, '格式化JSON')}
                          disabled={!formattedJson}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadJson(formattedJson, 'formatted.json')}
                          disabled={!formattedJson}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={formattedJson}
                      readOnly
                      className="min-h-[350px] resize-none bg-gray-50 font-mono text-sm"
                      placeholder="格式化后的JSON将显示在这里..."
                    />
                    <div className="text-sm text-gray-500">
                      字符数: {formattedJson.length}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="compress" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">压缩JSON</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(compressedJson, '压缩JSON')}
                          disabled={!compressedJson}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadJson(compressedJson, 'compressed.json')}
                          disabled={!compressedJson}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={compressedJson}
                      readOnly
                      className="min-h-[350px] resize-none bg-gray-50 font-mono text-sm"
                      placeholder="压缩后的JSON将显示在这里..."
                    />
                    <div className="text-sm text-gray-500">
                      字符数: {compressedJson.length}
                      {inputJson && compressedJson && (
                        <span className="ml-4">
                          压缩率: {((1 - compressedJson.length / inputJson.length) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 示例和说明 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 示例JSON */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">示例JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">简单对象：</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => loadExample('simple')}
                  >
                    加载示例
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">复杂数据结构：</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => loadExample('complex')}
                  >
                    加载示例
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">API响应格式：</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => loadExample('api')}
                  >
                    加载示例
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 功能说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">功能说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <Badge variant="secondary" className="mr-2">格式化</Badge>
                  将压缩的JSON格式化为易读的缩进格式
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">压缩</Badge>
                  移除JSON中的空格和换行，减小文件大小
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">验证</Badge>
                  实时检查JSON语法是否正确，显示错误信息
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">文件操作</Badge>
                  支持上传JSON文件和下载处理结果
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">语法高亮</Badge>
                  使用等宽字体显示，便于阅读和编辑
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">统计信息</Badge>
                  显示字符数和压缩率等统计数据
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 使用技巧 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">使用技巧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">常见用途：</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>API接口调试和测试</li>
                  <li>配置文件格式化</li>
                  <li>数据结构可视化</li>
                  <li>JSON数据压缩传输</li>
                  <li>代码格式规范化</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">注意事项：</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>确保JSON语法正确</li>
                  <li>字符串需要使用双引号</li>
                  <li>不支持注释和尾随逗号</li>
                  <li>大文件处理可能较慢</li>
                  <li>敏感数据请谨慎处理</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JsonEditor;