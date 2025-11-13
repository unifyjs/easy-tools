import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, ThumbsUp, Eye, CheckCircle, XCircle, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const JsonEditor: React.FC = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [compressedJson, setCompressedJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('format');

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleInputChange(content);
    };
    reader.readAsText(file);
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  const clearAll = () => {
    setInputJson('');
    setFormattedJson('');
    setCompressedJson('');
    setIsValid(null);
    setErrorMessage('');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 工具标题和统计 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center float-animation">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold category-title">JSON编辑器</h1>
            <p className="text-muted-foreground">在线JSON格式化、压缩、验证工具</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>150万次使用</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>2200个赞</span>
          </div>
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
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>错误:</strong> {errorMessage}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => loadExample('simple')}>
                简单示例
              </Button>
              <Button size="sm" variant="outline" onClick={() => loadExample('complex')}>
                复杂示例
              </Button>
              <Button size="sm" variant="outline" onClick={() => loadExample('api')}>
                API示例
              </Button>
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">格式化JSON</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(formattedJson)}
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
                    className="min-h-[350px] resize-none font-mono text-sm bg-secondary/50"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="compress" className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">压缩JSON</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(compressedJson)}
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
                    className="min-h-[350px] resize-none font-mono text-sm bg-secondary/50"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">常见用途：</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>API接口调试和测试</li>
                <li>配置文件格式化</li>
                <li>数据结构可视化</li>
                <li>JSON数据压缩传输</li>
                <li>代码格式规范化</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">注意事项：</h4>
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
  );
};

export default JsonEditor;