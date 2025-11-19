import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnicodeEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'unicode' | 'utf8' | 'utf16'>('unicode');
  const { toast } = useToast();

  const handleUnicodeEncode = () => {
    try {
      let result = '';
      for (let i = 0; i < inputText.length; i++) {
        const code = inputText.charCodeAt(i);
        if (format === 'unicode') {
          result += '\\u' + code.toString(16).padStart(4, '0');
        } else if (format === 'utf8') {
          result += '%u' + code.toString(16).padStart(4, '0').toUpperCase();
        } else if (format === 'utf16') {
          result += '&#' + code + ';';
        }
      }
      setOutputText(result);
    } catch (error) {
      toast({
        title: "编码失败",
        description: "请检查输入的文本是否正确",
        variant: "destructive",
      });
    }
  };

  const handleUnicodeDecode = () => {
    try {
      let result = inputText;
      
      if (format === 'unicode') {
        // 解码 \uXXXX 格式
        result = result.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      } else if (format === 'utf8') {
        // 解码 %uXXXX 格式
        result = result.replace(/%u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      } else if (format === 'utf16') {
        // 解码 &#数字; 格式
        result = result.replace(/&#(\d+);/g, (match, dec) => {
          return String.fromCharCode(parseInt(dec, 10));
        });
      }
      
      setOutputText(result);
    } catch (error) {
      toast({
        title: "解码失败",
        description: "请检查输入的Unicode编码是否正确",
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
      handleUnicodeEncode();
    } else {
      handleUnicodeDecode();
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
      { label: '中文字符', value: '你好世界' },
      { label: '特殊符号', value: '★♥♦♣♠' },
      { label: '表情符号', value: '😀😃😄😁' },
    ],
    decode: {
      unicode: [
        { label: 'Unicode格式', value: '\\u4f60\\u597d\\u4e16\\u754c' },
        { label: '特殊符号', value: '\\u2605\\u2665\\u2666\\u2663\\u2660' },
        { label: '表情符号', value: '\\ud83d\\ude00\\ud83d\\ude03\\ud83d\\ude04\\ud83d\\ude01' },
      ],
      utf8: [
        { label: 'UTF-8格式', value: '%u4F60%u597D%u4E16%u754C' },
        { label: '特殊符号', value: '%u2605%u2665%u2666%u2663%u2660' },
        { label: '表情符号', value: '%uD83D%uDE00%uD83D%uDE03%uD83D%uDE04%uD83D%uDE01' },
      ],
      utf16: [
        { label: 'UTF-16格式', value: '&#20320;&#22909;&#19990;&#30028;' },
        { label: '特殊符号', value: '&#9733;&#9829;&#9830;&#9827;&#9824;' },
        { label: '表情符号', value: '&#128512;&#128515;&#128516;&#128513;' },
      ]
    }
  };

  const getExamples = () => {
    if (mode === 'encode') {
      return examples.encode;
    } else {
      return examples.decode[format] || [];
    }
  };

  return (
    <>
      <SEOHead toolId="unicode-encoder" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Unicode编解码工具</h1>
          </div>
          <p className="text-gray-600">
            Unicode字符与编码的相互转换，支持多种格式
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 模式和格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>操作设置</CardTitle>
            <CardDescription>选择编码模式和格式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">操作模式</label>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  onClick={() => setMode('encode')}
                >
                  Unicode编码
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  onClick={() => setMode('decode')}
                >
                  Unicode解码
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
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">编码格式</label>
              <div className="flex gap-2">
                <Button
                  variant={format === 'unicode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('unicode')}
                >
                  \\uXXXX
                </Button>
                <Button
                  variant={format === 'utf8' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('utf8')}
                >
                  %uXXXX
                </Button>
                <Button
                  variant={format === 'utf16' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('utf16')}
                >
                  &#数字;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? '原始文本' : 'Unicode编码'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入要编码的原始文本' 
                : `输入要解码的Unicode编码 (${format}格式)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === 'encode' 
                ? '例如：你好世界' 
                : format === 'unicode' ? '例如：\\u4f60\\u597d\\u4e16\\u754c'
                : format === 'utf8' ? '例如：%u4F60%u597D%u4E16%u754C'
                : '例如：&#20320;&#22909;&#19990;&#30028;'
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
              {mode === 'encode' ? 'Unicode编码结果' : '解码结果'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? `编码后的Unicode字符 (${format}格式)` 
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
              {getExamples().map((example, index) => (
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

        {/* Unicode说明 */}
        <Card>
          <CardHeader>
            <CardTitle>Unicode编码说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Unicode是一种字符编码标准，为世界上大部分的文字系统提供了统一的编码方案。
              每个字符都有一个唯一的Unicode码点。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">支持的格式：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>\\uXXXX：</strong>JavaScript/JSON标准格式，如 \\u4f60 表示 "你"</div>
                <div><strong>%uXXXX：</strong>URL编码格式，如 %u4F60 表示 "你"</div>
                <div><strong>&#数字;：</strong>HTML数字实体格式，如 &#20320; 表示 "你"</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">常用Unicode范围：</h4>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <div>基本拉丁字母：U+0000-U+007F</div>
                <div>中日韩统一表意文字：U+4E00-U+9FFF</div>
                <div>表情符号：U+1F600-U+1F64F</div>
                <div>数学符号：U+2200-U+22FF</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default UnicodeEncoder;