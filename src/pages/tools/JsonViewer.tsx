import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, ArrowLeft, Eye, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const JsonViewer = () => {
  const [inputText, setInputText] = useState('');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'formatted'>('formatted');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleParse = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入JSON字符串",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      setParsedJson(parsed);
      toast({
        title: "解析成功",
        description: "JSON格式正确",
      });
    } catch (error: any) {
      toast({
        title: "解析失败",
        description: "JSON格式错误：" + error.message,
        variant: "destructive",
      });
      setParsedJson(null);
    }
  };

  const handleCopy = async () => {
    if (!parsedJson) {
      toast({
        title: "无内容可复制",
        description: "请先解析JSON",
        variant: "destructive",
      });
      return;
    }

    try {
      const formatted = JSON.stringify(parsedJson, null, 2);
      await navigator.clipboard.writeText(formatted);
      toast({
        title: "复制成功",
        description: "格式化的JSON已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制结果",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText('');
    setParsedJson(null);
  };

  const renderJsonTree = (obj: any, level = 0): React.ReactNode => {
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (typeof obj === 'string') return <span className="text-green-600">"{obj}"</span>;
    if (typeof obj === 'number') return <span className="text-blue-600">{obj}</span>;
    if (typeof obj === 'boolean') return <span className="text-purple-600">{obj.toString()}</span>;

    if (Array.isArray(obj)) {
      return (
        <div className={`ml-${level * 4}`}>
          <span className="text-gray-700">[</span>
          {obj.map((item, index) => (
            <div key={index} className="ml-4">
              {renderJsonTree(item, level + 1)}
              {index < obj.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          <span className="text-gray-700">]</span>
        </div>
      );
    }

    if (typeof obj === 'object') {
      return (
        <div className={`ml-${level * 4}`}>
          <span className="text-gray-700">{'{'}</span>
          {Object.entries(obj).map(([key, value], index, arr) => (
            <div key={key} className="ml-4">
              <span className="text-red-600">"{key}"</span>
              <span className="text-gray-700">: </span>
              {renderJsonTree(value, level + 1)}
              {index < arr.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          <span className="text-gray-700">{'}'}</span>
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON查看器</h1>
              <p className="text-gray-600 text-lg">美化和验证JSON数据，支持树形结构显示</p>
            </div>
          </div>
          <Badge variant="outline" className="mb-6">代码工具</Badge>
        </div>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>JSON输入</CardTitle>
            <CardDescription>输入要解析和查看的JSON字符串</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='请输入JSON字符串，例如：{"name": "张三", "age": 25}'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleParse}>解析JSON</Button>
              <Button variant="outline" onClick={handleClear}>清空</Button>
            </div>
          </CardContent>
        </Card>

        {/* 查看模式切换 */}
        {parsedJson && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>查看模式</CardTitle>
              <CardDescription>选择JSON的显示方式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={viewMode === 'formatted' ? 'default' : 'outline'}
                  onClick={() => setViewMode('formatted')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  格式化视图
                </Button>
                <Button
                  variant={viewMode === 'tree' ? 'default' : 'outline'}
                  onClick={() => setViewMode('tree')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  树形视图
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 输出区域 */}
        {parsedJson && (
          <Card>
            <CardHeader>
              <CardTitle>JSON结果</CardTitle>
              <CardDescription>
                {viewMode === 'formatted' ? '格式化的JSON字符串' : '树形结构显示'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === 'formatted' ? (
                <Textarea
                  value={JSON.stringify(parsedJson, null, 2)}
                  readOnly
                  className="min-h-[300px] resize-none bg-gray-50 font-mono"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg min-h-[300px] overflow-auto font-mono text-sm">
                  {renderJsonTree(parsedJson)}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;