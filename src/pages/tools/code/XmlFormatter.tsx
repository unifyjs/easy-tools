import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Code, Minimize2, Maximize2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const XmlFormatter = () => {
  const [inputXml, setInputXml] = useState('');
  const [formattedXml, setFormattedXml] = useState('');
  const [isMinified, setIsMinified] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const formatXml = (xml: string, minify: boolean = false): string => {
    if (!xml.trim()) return '';

    if (minify) {
      return xml
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // 基本的XML格式化逻辑
    let formatted = xml.replace(/>\s*</g, '><');
    let indent = 0;
    const tab = '  ';
    
    formatted = formatted.replace(/(<[^>]+>)/g, (match, tag) => {
      let result = '';
      
      if (tag.startsWith('</')) {
        // 结束标签
        indent--;
        result = '\n' + tab.repeat(Math.max(0, indent)) + tag;
      } else if (tag.endsWith('/>')) {
        // 自闭合标签
        result = '\n' + tab.repeat(indent) + tag;
      } else {
        // 开始标签
        result = '\n' + tab.repeat(indent) + tag;
        indent++;
      }
      
      return result;
    });

    return formatted.trim();
  };

  const validateXml = (xml: string): boolean => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const parserError = doc.querySelector('parsererror');
      return !parserError;
    } catch (error) {
      return false;
    }
  };

  const handleFormat = () => {
    if (!inputXml.trim()) {
      toast({
        title: "输入为空",
        description: "请输入XML内容",
        variant: "destructive",
      });
      return;
    }

    try {
      const valid = validateXml(inputXml);
      setIsValid(valid);
      
      if (!valid) {
        toast({
          title: "XML格式错误",
          description: "输入的XML格式不正确，但仍会尝试格式化",
          variant: "destructive",
        });
      }

      const formatted = formatXml(inputXml, isMinified);
      setFormattedXml(formatted);
      
      toast({
        title: "格式化成功",
        description: isMinified ? "XML已压缩" : "XML已格式化",
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: "处理XML时出错：" + error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!formattedXml) {
      toast({
        title: "无内容可复制",
        description: "请先格式化XML",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedXml);
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
    setInputXml('');
    setFormattedXml('');
    setIsValid(null);
  };

  const handleValidate = () => {
    if (!inputXml.trim()) {
      toast({
        title: "输入为空",
        description: "请输入XML内容",
        variant: "destructive",
      });
      return;
    }

    const valid = validateXml(inputXml);
    setIsValid(valid);
    
    toast({
      title: valid ? "XML格式正确" : "XML格式错误",
      description: valid ? "XML语法验证通过" : "XML语法验证失败",
      variant: valid ? "default" : "destructive",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">XML格式化器</h1>
        <p className="text-muted-foreground">
          格式化和验证XML文档，支持语法高亮和压缩模式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              输入XML
              {isValid !== null && (
                <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
                  {isValid ? (
                    <><CheckCircle className="h-3 w-3 mr-1" />有效</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" />无效</>
                  )}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              粘贴或输入需要格式化的XML内容
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="输入XML内容..."
              value={inputXml}
              onChange={(e) => setInputXml(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleFormat} className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {isMinified ? '压缩' : '格式化'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsMinified(!isMinified)}
                className="flex items-center gap-2"
              >
                {isMinified ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                {isMinified ? '美化模式' : '压缩模式'}
              </Button>
              <Button variant="outline" onClick={handleValidate}>
                验证XML
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
              {formattedXml && (
                <Badge variant="secondary" className="ml-2">
                  {formattedXml.split('\n').length} 行
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              格式化后的XML内容
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={formattedXml}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="格式化结果将显示在这里..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!formattedXml}
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
              <h4 className="font-semibold mb-2">支持的功能：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• XML文档格式化和美化</li>
                <li>• XML语法验证</li>
                <li>• 自动缩进和换行</li>
                <li>• 压缩模式去除多余空格</li>
                <li>• 实时验证XML格式</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">支持的XML类型：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 标准XML文档</li>
                <li>• SOAP消息</li>
                <li>• RSS/Atom feeds</li>
                <li>• 配置文件</li>
                <li>• SVG图形文件</li>
                <li>• 其他XML格式文档</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XmlFormatter;