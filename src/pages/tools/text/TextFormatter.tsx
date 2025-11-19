import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextFormatter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [formatType, setFormatType] = useState('json');
  const { toast } = useToast();

  const formatJSON = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      throw new Error('无效的JSON格式');
    }
  };

  const formatXML = (text: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xmlDoc);
    } catch (error) {
      throw new Error('无效的XML格式');
    }
  };

  const formatHTML = (text: string) => {
    // 简单的HTML格式化
    return text
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  const handleFormat = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要格式化的文本",
        variant: "destructive",
      });
      return;
    }

    try {
      let formatted = '';
      switch (formatType) {
        case 'json':
          formatted = formatJSON(inputText);
          break;
        case 'xml':
          formatted = formatXML(inputText);
          break;
        case 'html':
          formatted = formatHTML(inputText);
          break;
        default:
          formatted = inputText;
      }
      setOutputText(formatted);
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: error.message || "请检查输入的文本格式",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "无内容可复制",
        description: "请先进行格式化操作",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "格式化结果已复制到剪贴板",
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
    setOutputText('');
  };

  return (
    <>
      <SEOHead toolId="text-formatter" />
      <div className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* 格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>格式类型</CardTitle>
            <CardDescription>选择要格式化的文本类型</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={formatType} onValueChange={setFormatType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>原始文本</CardTitle>
            <CardDescription>输入要格式化的文本内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="请输入要格式化的文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-none font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleFormat}>格式化</Button>
              <Button variant="outline" onClick={handleClear}>清空</Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle>格式化结果</CardTitle>
            <CardDescription>格式化后的文本内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="格式化结果将显示在这里..."
              value={outputText}
              readOnly
              className="min-h-[200px] resize-none bg-gray-50 font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default TextFormatter;