import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HtmlEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '§': '&sect;',
    '¶': '&para;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '‰': '&permil;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '‾': '&oline;',
    '⁄': '&frasl;',
    '℘': '&weierp;',
    'ℑ': '&image;',
    'ℜ': '&real;',
    'ℵ': '&alefsym;',
    '←': '&larr;',
    '↑': '&uarr;',
    '→': '&rarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '↵': '&crarr;',
    '⇐': '&lArr;',
    '⇑': '&uArr;',
    '⇒': '&rArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;'
  };

  const handleEncode = () => {
    try {
      let encoded = inputText;
      // 替换HTML实体字符
      Object.keys(htmlEntities).forEach(char => {
        const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        encoded = encoded.replace(regex, htmlEntities[char]);
      });
      setOutputText(encoded);
    } catch (error) {
      toast({
        title: "编码失败",
        description: "请检查输入的文本是否正确",
        variant: "destructive",
      });
    }
  };

  const handleDecode = () => {
    try {
      let decoded = inputText;
      // 替换HTML实体为字符
      Object.entries(htmlEntities).forEach(([char, entity]) => {
        const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        decoded = decoded.replace(regex, char);
      });
      
      // 处理数字实体 &#数字; 和 &#x十六进制;
      decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
      });
      decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      
      setOutputText(decoded);
    } catch (error) {
      toast({
        title: "解码失败",
        description: "请检查输入的HTML实体是否正确",
        variant: "destructive",
      });
    }
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要处理的文本",
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

  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "无内容可复制",
        description: "请先进行编码或解码操作",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "结果已复制到剪贴板",
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

  const switchMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInputText(outputText);
    setOutputText('');
  };

  const examples = {
    encode: [
      { label: '基本HTML字符', value: '<div class="example">Hello & Welcome</div>' },
      { label: '特殊符号', value: '版权所有 © 2024 公司™' },
      { label: '引号和空格', value: 'He said "Hello World" & smiled.' },
    ],
    decode: [
      { label: 'HTML标签', value: '&lt;div class=&quot;example&quot;&gt;Hello &amp; Welcome&lt;/div&gt;' },
      { label: '特殊符号', value: '版权所有 &copy; 2024 公司&trade;' },
      { label: '数字实体', value: '&#72;&#101;&#108;&#108;&#111; &#87;&#111;&#114;&#108;&#100;' },
    ]
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">HTML编解码工具</h1>
          </div>
          <p className="text-gray-600">
            HTML实体字符编码和解码工具，处理HTML中的特殊字符
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 模式切换 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>操作模式</CardTitle>
            <CardDescription>选择编码或解码模式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={mode === 'encode' ? 'default' : 'outline'}
                onClick={() => setMode('encode')}
              >
                HTML编码
              </Button>
              <Button
                variant={mode === 'decode' ? 'default' : 'outline'}
                onClick={() => setMode('decode')}
              >
                HTML解码
              </Button>
              <Button
                variant="ghost"
                onClick={switchMode}
                className="ml-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                交换输入输出
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? '原始文本' : 'HTML实体文本'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入要编码的原始文本' 
                : '输入要解码的HTML实体文本'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === 'encode' 
                ? '例如：<div>Hello & World</div>' 
                : '例如：&lt;div&gt;Hello &amp; World&lt;/div&gt;'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleProcess}>
                {mode === 'encode' ? '编码' : '解码'}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? 'HTML实体结果' : '解码结果'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '编码后的HTML实体字符' 
                : '解码后的原始文本'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="结果将显示在这里..."
              value={outputText}
              readOnly
              className="min-h-[150px] resize-none bg-gray-50 font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 示例 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>示例</CardTitle>
            <CardDescription>点击示例可快速填入输入框</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {examples[mode].map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setInputText(example.value)}
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

        {/* HTML实体说明 */}
        <Card>
          <CardHeader>
            <CardTitle>HTML实体编码说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              HTML实体是用来在HTML文档中表示特殊字符的方法。某些字符在HTML中有特殊含义，
              如果要在网页中显示这些字符，就需要使用HTML实体。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">常用HTML实体：</h4>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <div>&amp; → &amp;amp;</div>
                <div>&lt; → &amp;lt;</div>
                <div>&gt; → &amp;gt;</div>
                <div>&quot; → &amp;quot;</div>
                <div>&copy; → &amp;copy;</div>
                <div>&reg; → &amp;reg;</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">数字实体格式：</h4>
              <p className="text-sm text-gray-600 font-mono">
                十进制：&amp;#数字; (如 &amp;#65; = A)<br/>
                十六进制：&amp;#x十六进制; (如 &amp;#x41; = A)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HtmlEncoder;