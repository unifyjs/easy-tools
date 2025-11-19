import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Link, Copy, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UrlEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const handleEncode = useCallback(() => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast({
        title: "编码成功",
        description: "URL已成功编码",
      });
    } catch (error) {
      toast({
        title: "编码失败",
        description: "请检查输入内容",
        variant: "destructive",
      });
    }
  }, [input, toast]);

  const handleDecode = useCallback(() => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast({
        title: "解码成功",
        description: "URL已成功解码",
      });
    } catch (error) {
      toast({
        title: "解码失败",
        description: "输入的URL编码格式不正确",
        variant: "destructive",
      });
    }
  }, [input, toast]);

  const handleProcess = () => {
    if (!input.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要处理的内容",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleSwapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    // 交换输入输出内容
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  const examples = {
    encode: [
      { label: '中文字符', value: '你好世界' },
      { label: '特殊字符', value: 'hello world!@#$%^&*()' },
      { label: '完整URL', value: 'https://example.com/search?q=测试查询&type=1' },
    ],
    decode: [
      { label: '编码的中文', value: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C' },
      { label: '编码的特殊字符', value: 'hello%20world!%40%23%24%25%5E%26*()' },
      { label: '编码的URL参数', value: 'https%3A//example.com/search%3Fq%3D%E6%B5%8B%E8%AF%95%E6%9F%A5%E8%AF%A2%26type%3D1' },
    ]
  };

  return (
    <>
      <SEOHead toolId="url-encoder" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">URL编解码工具</h1>
          </div>
          <p className="text-gray-600">
            URL编码和解码工具，处理特殊字符，支持中文和各种符号的转换
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 模式切换 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              处理模式
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={mode === 'encode' ? 'default' : 'outline'}
                onClick={() => setMode('encode')}
              >
                URL编码
              </Button>
              <Button
                variant={mode === 'decode' ? 'default' : 'outline'}
                onClick={() => setMode('decode')}
              >
                URL解码
              </Button>
              <Button
                variant="outline"
                onClick={handleSwapMode}
                className="ml-auto"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                交换模式
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? '原始文本' : '编码文本'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入需要进行URL编码的原始文本' 
                : '输入需要解码的URL编码文本'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === 'encode' 
                ? '例如：你好世界 或 https://example.com/search?q=测试' 
                : '例如：%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px] font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleProcess} className="flex-1">
                {mode === 'encode' ? '开始编码' : '开始解码'}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mode === 'encode' ? '编码结果' : '解码结果'}
              {output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(output)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder={`${mode === 'encode' ? '编码' : '解码'}结果将显示在这里...`}
              className="min-h-[120px] font-mono bg-gray-50"
            />
          </CardContent>
        </Card>

        {/* 示例 */}
        <Card>
          <CardHeader>
            <CardTitle>示例</CardTitle>
            <CardDescription>
              点击示例可快速填入输入框
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {examples[mode].map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setInput(example.value)}
                >
                  <div className="font-medium text-sm text-gray-700 mb-1">
                    {example.label}
                  </div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {example.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">URL编码（百分号编码）</h4>
              <p className="text-sm text-gray-600">
                将特殊字符转换为 %XX 格式，其中 XX 是字符的十六进制ASCII码。常用于URL参数传递。
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">URL解码</h4>
              <p className="text-sm text-gray-600">
                将 %XX 格式的编码字符还原为原始字符。用于解析URL中的编码参数。
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">常见应用场景</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• URL参数中包含中文或特殊字符</li>
                <li>• 处理表单提交的数据</li>
                <li>• API接口参数传递</li>
                <li>• 浏览器地址栏URL处理</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default UrlEncoder;