import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Md5Hash = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [format, setFormat] = useState<'lowercase' | 'uppercase'>('lowercase');
  const { toast } = useToast();

  // MD5 implementation
  const md5 = (str: string): string => {
    const rotateLeft = (value: number, amount: number): number => {
      return (value << amount) | (value >>> (32 - amount));
    };

    const addUnsigned = (x: number, y: number): number => {
      const x4 = x & 0x40000000;
      const y4 = y & 0x40000000;
      const x8 = x & 0x80000000;
      const y8 = y & 0x80000000;
      const result = (x & 0x3fffffff) + (y & 0x3fffffff);
      
      if (x4 & y4) {
        return result ^ 0x80000000 ^ x8 ^ y8;
      }
      if (x4 | y4) {
        if (result & 0x40000000) {
          return result ^ 0xc0000000 ^ x8 ^ y8;
        } else {
          return result ^ 0x40000000 ^ x8 ^ y8;
        }
      } else {
        return result ^ x8 ^ y8;
      }
    };

    const f = (x: number, y: number, z: number): number => {
      return (x & y) | (~x & z);
    };

    const g = (x: number, y: number, z: number): number => {
      return (x & z) | (y & ~z);
    };

    const h = (x: number, y: number, z: number): number => {
      return x ^ y ^ z;
    };

    const i = (x: number, y: number, z: number): number => {
      return y ^ (x | ~z);
    };

    const ff = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const gg = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const hh = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const ii = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str: string): number[] => {
      const wordArray: number[] = [];
      const messageLength = str.length;
      const numberOfWords = (((messageLength + 8) >>> 6) + 1) * 16;
      
      for (let i = 0; i < numberOfWords; i++) {
        wordArray[i] = 0;
      }
      
      for (let i = 0; i < messageLength; i++) {
        const bytePosition = i % 4;
        const byteCount = Math.floor(i / 4);
        wordArray[byteCount] |= str.charCodeAt(i) << (bytePosition * 8);
      }
      
      const bytePosition = messageLength % 4;
      const byteCount = Math.floor(messageLength / 4);
      wordArray[byteCount] |= 0x80 << (bytePosition * 8);
      wordArray[numberOfWords - 2] = messageLength << 3;
      wordArray[numberOfWords - 1] = messageLength >>> 29;
      
      return wordArray;
    };

    const wordToHex = (value: number): string => {
      let result = '';
      for (let i = 0; i <= 3; i++) {
        const byte = (value >>> (i * 8)) & 255;
        result += ('0' + byte.toString(16)).slice(-2);
      }
      return result;
    };

    const x = convertToWordArray(str);
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    for (let k = 0; k < x.length; k += 16) {
      const aa = a;
      const bb = b;
      const cc = c;
      const dd = d;

      a = ff(a, b, c, d, x[k], 7, 0xd76aa478);
      d = ff(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
      c = ff(c, d, a, b, x[k + 2], 17, 0x242070db);
      b = ff(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
      a = ff(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
      d = ff(d, a, b, c, x[k + 5], 12, 0x4787c62a);
      c = ff(c, d, a, b, x[k + 6], 17, 0xa8304613);
      b = ff(b, c, d, a, x[k + 7], 22, 0xfd469501);
      a = ff(a, b, c, d, x[k + 8], 7, 0x698098d8);
      d = ff(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
      c = ff(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
      b = ff(b, c, d, a, x[k + 11], 22, 0x895cd7be);
      a = ff(a, b, c, d, x[k + 12], 7, 0x6b901122);
      d = ff(d, a, b, c, x[k + 13], 12, 0xfd987193);
      c = ff(c, d, a, b, x[k + 14], 17, 0xa679438e);
      b = ff(b, c, d, a, x[k + 15], 22, 0x49b40821);

      a = gg(a, b, c, d, x[k + 1], 5, 0xf61e2562);
      d = gg(d, a, b, c, x[k + 6], 9, 0xc040b340);
      c = gg(c, d, a, b, x[k + 11], 14, 0x265e5a51);
      b = gg(b, c, d, a, x[k], 20, 0xe9b6c7aa);
      a = gg(a, b, c, d, x[k + 5], 5, 0xd62f105d);
      d = gg(d, a, b, c, x[k + 10], 9, 0x2441453);
      c = gg(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
      b = gg(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
      a = gg(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
      d = gg(d, a, b, c, x[k + 14], 9, 0xc33707d6);
      c = gg(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
      b = gg(b, c, d, a, x[k + 8], 20, 0x455a14ed);
      a = gg(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
      d = gg(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
      c = gg(c, d, a, b, x[k + 7], 14, 0x676f02d9);
      b = gg(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

      a = hh(a, b, c, d, x[k + 5], 4, 0xfffa3942);
      d = hh(d, a, b, c, x[k + 8], 11, 0x8771f681);
      c = hh(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
      b = hh(b, c, d, a, x[k + 14], 23, 0xfde5380c);
      a = hh(a, b, c, d, x[k + 1], 4, 0xa4beea44);
      d = hh(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
      c = hh(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
      b = hh(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
      a = hh(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
      d = hh(d, a, b, c, x[k], 11, 0xeaa127fa);
      c = hh(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
      b = hh(b, c, d, a, x[k + 6], 23, 0x4881d05);
      a = hh(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
      d = hh(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
      c = hh(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
      b = hh(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

      a = ii(a, b, c, d, x[k], 6, 0xf4292244);
      d = ii(d, a, b, c, x[k + 7], 10, 0x432aff97);
      c = ii(c, d, a, b, x[k + 14], 15, 0xab9423a7);
      b = ii(b, c, d, a, x[k + 5], 21, 0xfc93a039);
      a = ii(a, b, c, d, x[k + 12], 6, 0x655b59c3);
      d = ii(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
      c = ii(c, d, a, b, x[k + 10], 15, 0xffeff47d);
      b = ii(b, c, d, a, x[k + 1], 21, 0x85845dd1);
      a = ii(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
      d = ii(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
      c = ii(c, d, a, b, x[k + 6], 15, 0xa3014314);
      b = ii(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
      a = ii(a, b, c, d, x[k + 4], 6, 0xf7537e82);
      d = ii(d, a, b, c, x[k + 11], 10, 0xbd3af235);
      c = ii(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
      b = ii(b, c, d, a, x[k + 9], 21, 0xeb86d391);

      a = addUnsigned(a, aa);
      b = addUnsigned(b, bb);
      c = addUnsigned(c, cc);
      d = addUnsigned(d, dd);
    }

    const result = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要生成哈希的文本",
        variant: "destructive",
      });
      return;
    }

    try {
      const hash = md5(inputText);
      setOutputText(hash);
    } catch (error) {
      toast({
        title: "生成失败",
        description: "MD5哈希生成过程中出现错误",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "无内容可复制",
        description: "请先生成MD5哈希",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "MD5哈希已复制到剪贴板",
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

  const examples = [
    { label: '简单文本', value: 'Hello World' },
    { label: '中文文本', value: '你好世界' },
    { label: '数字字符', value: '123456789' },
    { label: '特殊字符', value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    { label: '空字符串', value: '' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">MD5哈希生成器</h1>
          </div>
          <p className="text-gray-600">
            生成文本的MD5哈希值，常用于数据完整性验证
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>输出格式</CardTitle>
            <CardDescription>选择MD5哈希的输出格式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={format === 'lowercase' ? 'default' : 'outline'}
                onClick={() => setFormat('lowercase')}
              >
                小写字母
              </Button>
              <Button
                variant={format === 'uppercase' ? 'default' : 'outline'}
                onClick={() => setFormat('uppercase')}
              >
                大写字母
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
            <CardDescription>输入要生成MD5哈希的文本内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="请输入要生成MD5哈希的文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleGenerate}>
                <Shield className="w-4 h-4 mr-2" />
                生成MD5哈希
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              MD5哈希结果
              {outputText && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>生成的32位MD5哈希值</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="MD5哈希结果将显示在这里..."
              value={outputText}
              readOnly
              className="min-h-[100px] resize-none bg-gray-50 font-mono text-lg"
            />
            {outputText && (
              <div className="mt-2 text-sm text-gray-500">
                长度: {outputText.length} 字符
              </div>
            )}
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
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setInputText(example.value)}
                >
                  <div className="font-medium text-sm text-gray-700 mb-1">
                    {example.label}
                  </div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {example.value || '(空字符串)'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MD5说明 */}
        <Card>
          <CardHeader>
            <CardTitle>MD5哈希说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              MD5（Message Digest Algorithm 5）是一种广泛使用的密码散列函数，
              可以产生出一个128位（16字节）的散列值，用于确保信息传输完整一致。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">MD5特点：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 固定长度：无论输入多长，输出都是32位十六进制字符</li>
                <li>• 不可逆：无法从哈希值反推出原始数据</li>
                <li>• 雪崩效应：输入的微小变化会导致输出的巨大变化</li>
                <li>• 确定性：相同输入总是产生相同输出</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-800">安全提醒：</h4>
              <p className="text-sm text-yellow-700">
                MD5已被发现存在安全漏洞，不建议用于安全敏感的应用。
                对于安全要求较高的场景，建议使用SHA-256等更安全的哈希算法。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Md5Hash;