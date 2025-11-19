import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HexEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'plain' | 'prefix' | 'space'>('plain');
  const { toast } = useToast();

  const handleHexEncode = () => {
    try {
      let result = '';
      for (let i = 0; i < inputText.length; i++) {
        const hex = inputText.charCodeAt(i).toString(16).padStart(2, '0');
        if (format === 'plain') {
          result += hex;
        } else if (format === 'prefix') {
          result += '0x' + hex + (i < inputText.length - 1 ? ' ' : '');
        } else if (format === 'space') {
          result += hex + (i < inputText.length - 1 ? ' ' : '');
        }
      }
      setOutputText(result.toUpperCase());
    } catch (error) {
      toast({
        title: "编码失败",
        description: "请检查输入的文本是否正确",
        variant: "destructive",
      });
    }
  };

  const handleHexDecode = () => {
    try {
      let input = inputText.trim();
      
      // 移除0x前缀
      input = input.replace(/0x/g, '');
      // 移除空格
      input = input.replace(/\s+/g, '');
      
      // 确保是偶数长度
      if (input.length % 2 !== 0) {
        throw new Error('Invalid hex string length');
      }
      
      let result = '';
      for (let i = 0; i < input.length; i += 2) {
        const hex = input.substr(i, 2);
        const charCode = parseInt(hex, 16);
        if (isNaN(charCode)) {
          throw new Error('Invalid hex character');
        }
        result += String.fromCharCode(charCode);
      }
      
      setOutputText(result);
    } catch (error) {
      toast({
        title: "解码失败",
        description: "请检查输入的十六进制编码是否正确",
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
      handleHexEncode();
    } else {
      handleHexDecode();
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
      { label: '英文文本', value: 'Hello World' },
      { label: '中文文本', value: '你好世界' },
      { label: '特殊字符', value: '!@#$%^&*()' },
    ],
    decode: {
      plain: [
        { label: '纯十六进制', value: '48656C6C6F20576F726C64' },
        { label: '中文十六进制', value: 'E4BDA0E5A5BDE4B896E7958C' },
        { label: '特殊字符', value: '21402324255E262A2829' },
      ],
      prefix: [
        { label: '0x前缀格式', value: '0x48 0x65 0x6C 0x6C 0x6F 0x20 0x57 0x6F 0x72 0x6C 0x64' },
        { label: '中文0x格式', value: '0xE4 0xBD 0xA0 0xE5 0xA5 0xBD 0xE4 0xB8 0x96 0xE7 0x95 0x8C' },
      ],
      space: [
        { label: '空格分隔', value: '48 65 6C 6C 6F 20 57 6F 72 6C 64' },
        { label: '中文空格分隔', value: 'E4 BD A0 E5 A5 BD E4 B8 96 E7 95 8C' },
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
      <SEOHead toolId="hex-encoder" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Hex编解码工具</h1>
          </div>
          <p className="text-gray-600">
            十六进制编码和解码工具，支持多种格式输出
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 模式和格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>操作设置</CardTitle>
            <CardDescription>选择编码模式和输出格式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">操作模式</label>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  onClick={() => setMode('encode')}
                >
                  Hex编码
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  onClick={() => setMode('decode')}
                >
                  Hex解码
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
            
            {mode === 'encode' && (
              <div>
                <label className="text-sm font-medium mb-2 block">输出格式</label>
                <div className="flex gap-2">
                  <Button
                    variant={format === 'plain' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormat('plain')}
                  >
                    纯十六进制
                  </Button>
                  <Button
                    variant={format === 'prefix' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormat('prefix')}
                  >
                    0x前缀
                  </Button>
                  <Button
                    variant={format === 'space' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormat('space')}
                  >
                    空格分隔
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? '原始文本' : '十六进制编码'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入要编码的原始文本' 
                : '输入要解码的十六进制编码（支持多种格式）'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === 'encode' 
                ? '例如：Hello World' 
                : '例如：48656C6C6F20576F726C64 或 0x48 0x65 0x6C...'
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
              {mode === 'encode' ? '十六进制结果' : '解码结果'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? `编码后的十六进制字符 (${format}格式)` 
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

        {/* 十六进制说明 */}
        <Card>
          <CardHeader>
            <CardTitle>十六进制编码说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              十六进制编码是将字符转换为其对应的十六进制ASCII码值的过程。
              每个字符对应一个或多个字节，每个字节用两位十六进制数表示。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">支持的格式：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>纯十六进制：</strong>连续的十六进制字符，如 48656C6C6F</div>
                <div><strong>0x前缀：</strong>每个字节前加0x，如 0x48 0x65 0x6C 0x6C 0x6F</div>
                <div><strong>空格分隔：</strong>字节间用空格分隔，如 48 65 6C 6C 6F</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">十六进制数字对照：</h4>
              <div className="grid grid-cols-4 gap-2 text-sm font-mono">
                <div>0-9 → 0-9</div>
                <div>A → 10</div>
                <div>B → 11</div>
                <div>C → 12</div>
                <div>D → 13</div>
                <div>E → 14</div>
                <div>F → 15</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default HexEncoder;