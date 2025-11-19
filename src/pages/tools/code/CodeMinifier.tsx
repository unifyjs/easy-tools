import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Minimize2, Code, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CodeType = 'javascript' | 'css' | 'html' | 'json';

const CodeMinifier = () => {
  const [inputCode, setInputCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [codeType, setCodeType] = useState<CodeType>('javascript');
  const { toast } = useToast();

  const minifyJavaScript = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
      .replace(/\/\/.*$/gm, '') // 移除单行注释
      .replace(/\s+/g, ' ') // 合并空白字符
      .replace(/;\s*}/g, '}') // 移除分号前的空格
      .replace(/\s*{\s*/g, '{') // 格式化大括号
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';') // 格式化分号
      .replace(/\s*,\s*/g, ',') // 格式化逗号
      .replace(/\s*:\s*/g, ':') // 格式化冒号
      .replace(/\s*=\s*/g, '=') // 格式化等号
      .replace(/\s*\+\s*/g, '+') // 格式化加号
      .replace(/\s*-\s*/g, '-') // 格式化减号
      .replace(/\s*\*\s*/g, '*') // 格式化乘号
      .replace(/\s*\/\s*/g, '/') // 格式化除号
      .replace(/\s*\(\s*/g, '(') // 格式化括号
      .replace(/\s*\)\s*/g, ')')
      .trim();
  };

  const minifyCSS = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 合并空白字符
      .replace(/;\s*}/g, '}') // 移除最后一个分号
      .replace(/\s*{\s*/g, '{') // 格式化大括号
      .replace(/\s*}\s*/g, '}')
      .replace(/;\s*/g, ';') // 格式化分号
      .replace(/,\s*/g, ',') // 格式化逗号
      .replace(/:\s*/g, ':') // 格式化冒号
      .replace(/\s*>\s*/g, '>') // 格式化选择器
      .replace(/\s*\+\s*/g, '+')
      .replace(/\s*~\s*/g, '~')
      .trim();
  };

  const minifyHTML = (code: string): string => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML注释
      .replace(/\s+/g, ' ') // 合并空白字符
      .replace(/>\s+</g, '><') // 移除标签间空白
      .replace(/\s*=\s*/g, '=') // 格式化属性
      .replace(/\s+>/g, '>') // 移除标签结束前空白
      .replace(/\s+\/>/g, '/>') // 格式化自闭合标签
      .trim();
  };

  const minifyJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed);
    } catch (error) {
      // 如果JSON解析失败，使用基本的压缩方法
      return code
        .replace(/\s+/g, ' ')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*\[\s*/g, '[')
        .replace(/\s*\]\s*/g, ']')
        .trim();
    }
  };

  const minifyCode = (code: string, type: CodeType): string => {
    switch (type) {
      case 'javascript':
        return minifyJavaScript(code);
      case 'css':
        return minifyCSS(code);
      case 'html':
        return minifyHTML(code);
      case 'json':
        return minifyJSON(code);
      default:
        return code;
    }
  };

  const calculateSavings = (original: string, minified: string) => {
    const originalSize = original.length;
    const minifiedSize = minified.length;
    const savings = originalSize - minifiedSize;
    const percentage = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : '0';
    
    return {
      originalSize,
      minifiedSize,
      savings,
      percentage: parseFloat(percentage)
    };
  };

  const handleMinify = () => {
    if (!inputCode.trim()) {
      toast({
        title: "输入为空",
        description: "请输入需要压缩的代码",
        variant: "destructive",
      });
      return;
    }

    try {
      const minified = minifyCode(inputCode, codeType);
      setMinifiedCode(minified);
      
      const stats = calculateSavings(inputCode, minified);
      
      toast({
        title: "压缩成功",
        description: `文件大小减少了 ${stats.savings} 字符 (${stats.percentage}%)`,
      });
    } catch (error: any) {
      toast({
        title: "压缩失败",
        description: "处理代码时出错：" + error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!minifiedCode) {
      toast({
        title: "无内容可复制",
        description: "请先压缩代码",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(minifiedCode);
      toast({
        title: "复制成功",
        description: "已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputCode('');
    setMinifiedCode('');
  };

  const stats = inputCode && minifiedCode ? calculateSavings(inputCode, minifiedCode) : null;

  const getCodeTypeIcon = (type: CodeType) => {
    switch (type) {
      case 'javascript':
        return '🟨';
      case 'css':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '📄';
      default:
        return '📝';
    }
  };

  return (
    <>
      <SEOHead toolId="codeminifier" />
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">代码压缩器</h1>
        <p className="text-muted-foreground">
          压缩JavaScript、CSS、HTML、JSON代码，减小文件大小，提升加载性能
        </p>
      </div>

      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minimize2 className="h-5 w-5" />
              压缩统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.originalSize}</div>
                <div className="text-sm text-muted-foreground">原始大小</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.minifiedSize}</div>
                <div className="text-sm text-muted-foreground">压缩后大小</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.savings}</div>
                <div className="text-sm text-muted-foreground">节省字符</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.percentage}%</div>
                <div className="text-sm text-muted-foreground">压缩率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              输入代码
              <span className="text-lg">{getCodeTypeIcon(codeType)}</span>
            </CardTitle>
            <CardDescription>
              选择代码类型并输入需要压缩的代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={codeType} onValueChange={(value: CodeType) => setCodeType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择代码类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">🟨 JavaScript</SelectItem>
                <SelectItem value="css">🎨 CSS</SelectItem>
                <SelectItem value="html">🌐 HTML</SelectItem>
                <SelectItem value="json">📄 JSON</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea
              placeholder={`输入${codeType.toUpperCase()}代码...`}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleMinify} className="flex items-center gap-2">
                <Minimize2 className="h-4 w-4" />
                压缩代码
              </Button>
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              压缩结果
              {minifiedCode && (
                <Badge variant="secondary" className="ml-2">
                  {minifiedCode.length} 字符
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              压缩后的代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={minifiedCode}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="压缩结果将显示在这里..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!minifiedCode}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">压缩功能：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 移除注释和多余空白</li>
                <li>• 合并相邻的空白字符</li>
                <li>• 优化代码结构</li>
                <li>• 减小文件大小</li>
                <li>• 提升网页加载速度</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">支持的代码类型：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• JavaScript (.js) 文件</li>
                <li>• CSS (.css) 样式表</li>
                <li>• HTML (.html) 网页文件</li>
                <li>• JSON (.json) 数据文件</li>
                <li>• 自动检测和优化</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default CodeMinifier;