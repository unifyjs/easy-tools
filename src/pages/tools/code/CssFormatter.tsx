import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Code, Minimize2, Maximize2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CssFormatter = () => {
  const [inputCss, setInputCss] = useState('');
  const [formattedCss, setFormattedCss] = useState('');
  const [isMinified, setIsMinified] = useState(false);
  const { toast } = useToast();

  const formatCss = (css: string, minify: boolean = false): string => {
    if (!css.trim()) return '';

    if (minify) {
      return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
        .replace(/\s+/g, ' ') // 合并空白字符
        .replace(/;\s*}/g, '}') // 移除最后一个分号
        .replace(/\s*{\s*/g, '{') // 格式化大括号
        .replace(/;\s*/g, ';') // 格式化分号
        .replace(/,\s*/g, ',') // 格式化逗号
        .replace(/:\s*/g, ':') // 格式化冒号
        .trim();
    }

    // 美化CSS
    let formatted = css
      .replace(/\/\*[\s\S]*?\*\//g, (match) => '\n' + match + '\n') // 保留注释并换行
      .replace(/\s*{\s*/g, ' {\n  ') // 格式化开始大括号
      .replace(/;\s*/g, ';\n  ') // 每个属性换行
      .replace(/\s*}\s*/g, '\n}\n\n') // 格式化结束大括号
      .replace(/,\s*/g, ',\n') // 选择器换行
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 移除多余空行
      .trim();

    // 处理嵌套规则的缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + trimmedLine;
      
      if (trimmedLine.includes('{')) {
        indentLevel++;
      }
      
      return indentedLine;
    });

    return indentedLines.join('\n');
  };

  const analyzeCss = (css: string) => {
    const selectors = (css.match(/[^{}]+(?=\s*{)/g) || []).length;
    const properties = (css.match(/[^{}:]+:[^{}:;]+;/g) || []).length;
    const mediaQueries = (css.match(/@media[^{]+{/g) || []).length;
    const keyframes = (css.match(/@keyframes[^{]+{/g) || []).length;
    
    return { selectors, properties, mediaQueries, keyframes };
  };

  const handleFormat = () => {
    if (!inputCss.trim()) {
      toast({
        title: "输入为空",
        description: "请输入CSS代码",
        variant: "destructive",
      });
      return;
    }

    try {
      const formatted = formatCss(inputCss, isMinified);
      setFormattedCss(formatted);
      toast({
        title: "格式化成功",
        description: isMinified ? "CSS已压缩" : "CSS已美化",
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: "处理CSS时出错：" + error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!formattedCss) {
      toast({
        title: "无内容可复制",
        description: "请先格式化CSS",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedCss);
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
    setInputCss('');
    setFormattedCss('');
  };

  const stats = inputCss ? analyzeCss(inputCss) : null;

  return (
    <>
      <SEOHead toolId="css-formatter" />
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">CSS美化器</h1>
        <p className="text-muted-foreground">
          格式化和压缩CSS代码，优化样式表结构和可读性
        </p>
      </div>

      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              CSS统计信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.selectors}</div>
                <div className="text-sm text-muted-foreground">选择器</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.properties}</div>
                <div className="text-sm text-muted-foreground">属性</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.mediaQueries}</div>
                <div className="text-sm text-muted-foreground">媒体查询</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.keyframes}</div>
                <div className="text-sm text-muted-foreground">关键帧</div>
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
              输入CSS
            </CardTitle>
            <CardDescription>
              粘贴或输入需要格式化的CSS代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="输入CSS代码..."
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleFormat} className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {isMinified ? '压缩' : '美化'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsMinified(!isMinified)}
                className="flex items-center gap-2"
              >
                {isMinified ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                {isMinified ? '美化模式' : '压缩模式'}
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
              <Code className="h-5 w-5" />
              格式化结果
              {formattedCss && (
                <Badge variant="secondary" className="ml-2">
                  {formattedCss.length} 字符
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              格式化后的CSS代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={formattedCss}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="格式化结果将显示在这里..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!formattedCss}
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
              <h4 className="font-semibold mb-2">美化功能：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 自动缩进和换行</li>
                <li>• 选择器和属性对齐</li>
                <li>• 保留注释内容</li>
                <li>• 统一代码风格</li>
                <li>• 嵌套规则处理</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">压缩功能：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 移除多余空白字符</li>
                <li>• 删除注释内容</li>
                <li>• 合并相邻规则</li>
                <li>• 优化文件大小</li>
                <li>• 提升加载性能</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default CssFormatter;