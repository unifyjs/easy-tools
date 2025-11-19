import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AsciiEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'decimal' | 'hex' | 'binary' | 'octal'>('decimal');
  const [separator, setSeparator] = useState<'space' | 'comma' | 'none'>('space');
  const { toast } = useToast();

  const handleAsciiEncode = () => {
    try {
      let result: string[] = [];
      
      for (let i = 0; i < inputText.length; i++) {
        const code = inputText.charCodeAt(i);
        
        switch (format) {
          case 'decimal':
            result.push(code.toString());
            break;
          case 'hex':
            result.push(code.toString(16).toUpperCase());
            break;
          case 'binary':
            result.push(code.toString(2));
            break;
          case 'octal':
            result.push(code.toString(8));
            break;
        }
      }
      
      let output = '';
      switch (separator) {
        case 'space':
          output = result.join(' ');
          break;
        case 'comma':
          output = result.join(', ');
          break;
        case 'none':
          output = result.join('');
          break;
      }
      
      setOutputText(output);
    } catch (error) {
      toast({
        title: "编码失败",
        description: "请检查输入的文本是否正确",
        variant: "destructive",
      });
    }
  };

  const handleAsciiDecode = () => {
    try {
      let input = inputText.trim();
      let codes: string[] = [];
      
      // 根据分隔符分割输入
      if (separator === 'space') {
        codes = input.split(/\s+/);
      } else if (separator === 'comma') {
        codes = input.split(/,\s*/);
      } else {
        // 对于无分隔符的情况，需要根据格式推断
        if (format === 'decimal') {
          // 十进制：假设每个字符的ASCII码都是1-3位数字
          codes = input.match(/\d{1,3}/g) || [];
        } else if (format === 'hex') {
          // 十六进制：每2个字符一组
          codes = input.match(/.{1,2}/g) || [];
        } else if (format === 'binary') {
          // 二进制：每7-8位一组
          codes = input.match(/.{7,8}/g) || [];
        } else if (format === 'octal') {
          // 八进制：每3位一组
          codes = input.match(/.{1,3}/g) || [];
        }
      }
      
      let result = '';
      for (const code of codes) {
        if (!code.trim()) continue;
        
        let charCode: number;
        switch (format) {
          case 'decimal':
            charCode = parseInt(code, 10);
            break;
          case 'hex':
            charCode = parseInt(code, 16);
            break;
          case 'binary':
            charCode = parseInt(code, 2);
            break;
          case 'octal':
            charCode = parseInt(code, 8);
            break;
          default:
            charCode = 0;
        }
        
        if (isNaN(charCode) || charCode < 0 || charCode > 127) {
          throw new Error(`Invalid ASCII code: ${code}`);
        }
        
        result += String.fromCharCode(charCode);
      }
      
      setOutputText(result);
    } catch (error) {
      toast({
        title: "解码失败",
        description: "请检查输入的ASCII编码是否正确",
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
      handleAsciiEncode();
    } else {
      handleAsciiDecode();
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
      { label: '英文字符', value: 'Hello' },
      { label: '数字字符', value: '12345' },
      { label: '特殊符号', value: '!@#$%' },
      { label: '空格和标点', value: 'A B, C.' },
    ],
    decode: {
      decimal: [
        { label: '十进制(空格分隔)', value: '72 101 108 108 111' },
        { label: '十进制(逗号分隔)', value: '72, 101, 108, 108, 111' },
        { label: '数字和符号', value: '49 50 51 52 53' },
      ],
      hex: [
        { label: '十六进制(空格分隔)', value: '48 65 6C 6C 6F' },
        { label: '十六进制(逗号分隔)', value: '48, 65, 6C, 6C, 6F' },
        { label: '十六进制(无分隔)', value: '48656C6C6F' },
      ],
      binary: [
        { label: '二进制(空格分隔)', value: '1001000 1100101 1101100 1101100 1101111' },
        { label: '二进制(逗号分隔)', value: '1001000, 1100101, 1101100, 1101100, 1101111' },
      ],
      octal: [
        { label: '八进制(空格分隔)', value: '110 145 154 154 157' },
        { label: '八进制(逗号分隔)', value: '110, 145, 154, 154, 157' },
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

  const getFormatName = () => {
    switch (format) {
      case 'decimal': return '十进制';
      case 'hex': return '十六进制';
      case 'binary': return '二进制';
      case 'octal': return '八进制';
      default: return '';
    }
  };

  return (
    <>
      <SEOHead toolId="ascii-encoder" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Type className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">ASCII编解码工具</h1>
          </div>
          <p className="text-gray-600">
            ASCII码与字符的相互转换，支持多种进制格式
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 设置区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>转换设置</CardTitle>
            <CardDescription>选择转换模式、进制格式和分隔符</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">转换模式</label>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  onClick={() => setMode('encode')}
                >
                  字符转ASCII
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  onClick={() => setMode('decode')}
                >
                  ASCII转字符
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
              <label className="text-sm font-medium mb-2 block">进制格式</label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={format === 'decimal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('decimal')}
                >
                  十进制
                </Button>
                <Button
                  variant={format === 'hex' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('hex')}
                >
                  十六进制
                </Button>
                <Button
                  variant={format === 'binary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('binary')}
                >
                  二进制
                </Button>
                <Button
                  variant={format === 'octal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('octal')}
                >
                  八进制
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">分隔符</label>
              <div className="flex gap-2">
                <Button
                  variant={separator === 'space' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSeparator('space')}
                >
                  空格
                </Button>
                <Button
                  variant={separator === 'comma' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSeparator('comma')}
                >
                  逗号
                </Button>
                <Button
                  variant={separator === 'none' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSeparator('none')}
                >
                  无分隔
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === 'encode' ? '原始字符' : `ASCII编码 (${getFormatName()})`}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入要转换为ASCII码的字符' 
                : `输入要解码的ASCII编码 (${getFormatName()}格式)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === 'encode' 
                ? '例如：Hello World' 
                : format === 'decimal' ? '例如：72 101 108 108 111'
                : format === 'hex' ? '例如：48 65 6C 6C 6F'
                : format === 'binary' ? '例如：1001000 1100101 1101100'
                : '例如：110 145 154 154 157'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none font-mono"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleProcess}>
                {mode === 'encode' ? '转换为ASCII' : '转换为字符'}
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
              {mode === 'encode' ? `ASCII编码结果 (${getFormatName()})` : '字符结果'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? `转换后的ASCII编码 (${getFormatName()}格式)` 
                : '解码后的原始字符'
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

        {/* ASCII码表 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ASCII码表 (常用字符)</CardTitle>
            <CardDescription>常用ASCII字符对照表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
              <div>
                <h4 className="font-semibold mb-2">数字 (48-57)</h4>
                <div className="space-y-1">
                  {Array.from({length: 10}, (_, i) => (
                    <div key={i}>
                      {String.fromCharCode(48 + i)} = {48 + i}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">大写字母 (65-90)</h4>
                <div className="space-y-1">
                  {Array.from({length: 26}, (_, i) => (
                    <div key={i}>
                      {String.fromCharCode(65 + i)} = {65 + i}
                    </div>
                  )).slice(0, 10)}
                  <div className="text-gray-500">...</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">小写字母 (97-122)</h4>
                <div className="space-y-1">
                  {Array.from({length: 26}, (_, i) => (
                    <div key={i}>
                      {String.fromCharCode(97 + i)} = {97 + i}
                    </div>
                  )).slice(0, 10)}
                  <div className="text-gray-500">...</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">特殊字符</h4>
                <div className="space-y-1">
                  <div>空格 = 32</div>
                  <div>! = 33</div>
                  <div>" = 34</div>
                  <div># = 35</div>
                  <div>$ = 36</div>
                  <div>% = 37</div>
                  <div>& = 38</div>
                  <div>' = 39</div>
                  <div>( = 40</div>
                  <div>) = 41</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ASCII说明 */}
        <Card>
          <CardHeader>
            <CardTitle>ASCII编码说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              ASCII（American Standard Code for Information Interchange）是基于拉丁字母的一套电脑编码系统。
              ASCII码使用7位二进制数来表示128个字符，包括英文字母、数字、标点符号和控制字符。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ASCII码范围：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>0-31：</strong>控制字符（如换行、制表符等）</div>
                <div><strong>32-47：</strong>空格和标点符号</div>
                <div><strong>48-57：</strong>数字字符 0-9</div>
                <div><strong>58-64：</strong>标点符号</div>
                <div><strong>65-90：</strong>大写字母 A-Z</div>
                <div><strong>91-96：</strong>标点符号</div>
                <div><strong>97-122：</strong>小写字母 a-z</div>
                <div><strong>123-127：</strong>标点符号</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">进制转换：</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>十进制：</strong>最常用，直接显示数值</div>
                <div><strong>十六进制：</strong>程序员常用，简洁表示</div>
                <div><strong>二进制：</strong>计算机内部表示</div>
                <div><strong>八进制：</strong>早期系统常用</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default AsciiEncoder;