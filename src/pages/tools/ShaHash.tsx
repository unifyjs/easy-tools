import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShaHash = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState<'sha1' | 'sha256'>('sha256');
  const [format, setFormat] = useState<'lowercase' | 'uppercase'>('lowercase');
  const { toast } = useToast();

  // SHA-1 implementation
  const sha1 = (str: string): string => {
    const rotateLeft = (n: number, s: number): number => {
      return (n << s) | (n >>> (32 - s));
    };

    const cvtHex = (val: number): string => {
      let str = '';
      for (let i = 7; i >= 0; i--) {
        const v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    };

    const utf8Encode = (str: string): string => {
      str = str.replace(/\r\n/g, '\n');
      let utftext = '';
      for (let n = 0; n < str.length; n++) {
        const c = str.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };

    str = utf8Encode(str);
    const strLen = str.length;
    const wordArray: number[] = [];
    
    for (let i = 0; i < strLen - 3; i += 4) {
      const j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
                str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
      wordArray.push(j);
    }

    switch (strLen % 4) {
      case 0:
        wordArray.push(0x080000000);
        break;
      case 1:
        wordArray.push(str.charCodeAt(strLen - 1) << 24 | 0x0800000);
        break;
      case 2:
        wordArray.push(str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000);
        break;
      case 3:
        wordArray.push(str.charCodeAt(strLen - 3) << 24 | str.charCodeAt(strLen - 2) << 16 | str.charCodeAt(strLen - 1) << 8 | 0x80);
        break;
    }

    while ((wordArray.length % 16) !== 14) {
      wordArray.push(0);
    }

    wordArray.push(strLen >>> 29);
    wordArray.push((strLen << 3) & 0x0ffffffff);

    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;

    for (let i = 0; i < wordArray.length; i += 16) {
      const w: number[] = [];
      for (let j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = wordArray[i + j];
        } else {
          w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;

      for (let j = 0; j < 80; j++) {
        let f: number;
        let k: number;

        if (j < 20) {
          f = (b & c) | ((~b) & d);
          k = 0x5A827999;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }

        const temp = (rotateLeft(a, 5) + f + e + k + w[j]) & 0x0ffffffff;
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }

      h0 = (h0 + a) & 0x0ffffffff;
      h1 = (h1 + b) & 0x0ffffffff;
      h2 = (h2 + c) & 0x0ffffffff;
      h3 = (h3 + d) & 0x0ffffffff;
      h4 = (h4 + e) & 0x0ffffffff;
    }

    const result = cvtHex(h0) + cvtHex(h1) + cvtHex(h2) + cvtHex(h3) + cvtHex(h4);
    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  // SHA-256 implementation
  const sha256 = (str: string): string => {
    const rightRotate = (value: number, amount: number): number => {
      return (value >>> amount) | (value << (32 - amount));
    };

    const utf8Encode = (str: string): string => {
      return unescape(encodeURIComponent(str));
    };

    str = utf8Encode(str);
    const strBin = str.split('').map(c => c.charCodeAt(0));
    const strLen = strBin.length;
    const strLenBits = strLen * 8;

    // Pre-processing: adding a single 1 bit
    strBin.push(0x80);

    // Pre-processing: padding with zeros
    while (strBin.length % 64 !== 56) {
      strBin.push(0x00);
    }

    // Append original length in bits mod 2^64 to message
    for (let i = 7; i >= 0; i--) {
      strBin.push((strLenBits >>> (i * 8)) & 0xff);
    }

    // Initialize hash values
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    // Initialize array of round constants
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Process the message in successive 512-bit chunks
    for (let chunk = 0; chunk < strBin.length; chunk += 64) {
      const w: number[] = [];

      // Break chunk into sixteen 32-bit big-endian words
      for (let i = 0; i < 16; i++) {
        w[i] = (strBin[chunk + i * 4] << 24) | (strBin[chunk + i * 4 + 1] << 16) |
               (strBin[chunk + i * 4 + 2] << 8) | strBin[chunk + i * 4 + 3];
      }

      // Extend the first 16 words into the remaining 48 words
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;
      }

      // Initialize working variables
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      // Compression function main loop
      for (let i = 0; i < 64; i++) {
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + s1 + ch + k[i] + w[i]) & 0xffffffff;
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (s0 + maj) & 0xffffffff;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xffffffff;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xffffffff;
      }

      // Add the compressed chunk to the current hash value
      h0 = (h0 + a) & 0xffffffff;
      h1 = (h1 + b) & 0xffffffff;
      h2 = (h2 + c) & 0xffffffff;
      h3 = (h3 + d) & 0xffffffff;
      h4 = (h4 + e) & 0xffffffff;
      h5 = (h5 + f) & 0xffffffff;
      h6 = (h6 + g) & 0xffffffff;
      h7 = (h7 + h) & 0xffffffff;
    }

    // Produce the final hash value
    const result = [h0, h1, h2, h3, h4, h5, h6, h7]
      .map(h => h.toString(16).padStart(8, '0'))
      .join('');

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
      const hash = algorithm === 'sha1' ? sha1(inputText) : sha256(inputText);
      setOutputText(hash);
    } catch (error) {
      toast({
        title: "生成失败",
        description: "SHA哈希生成过程中出现错误",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "无内容可复制",
        description: "请先生成SHA哈希",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "SHA哈希已复制到剪贴板",
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
            <h1 className="text-3xl font-bold">SHA哈希生成器</h1>
          </div>
          <p className="text-gray-600">
            生成文本的SHA-1或SHA-256哈希值，用于数据完整性验证和安全应用
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 算法和格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>哈希设置</CardTitle>
            <CardDescription>选择哈希算法和输出格式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">哈希算法</label>
              <div className="flex gap-2">
                <Button
                  variant={algorithm === 'sha1' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha1')}
                >
                  SHA-1 (160位)
                </Button>
                <Button
                  variant={algorithm === 'sha256' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha256')}
                >
                  SHA-256 (256位)
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">输出格式</label>
              <div className="flex gap-2">
                <Button
                  variant={format === 'lowercase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('lowercase')}
                >
                  小写字母
                </Button>
                <Button
                  variant={format === 'uppercase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('uppercase')}
                >
                  大写字母
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
            <CardDescription>输入要生成SHA哈希的文本内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="请输入要生成SHA哈希的文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleGenerate}>
                <Shield className="w-4 h-4 mr-2" />
                生成{algorithm.toUpperCase()}哈希
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
              {algorithm.toUpperCase()}哈希结果
              {outputText && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              生成的{algorithm === 'sha1' ? '40位' : '64位'}SHA哈希值
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`${algorithm.toUpperCase()}哈希结果将显示在这里...`}
              value={outputText}
              readOnly
              className="min-h-[100px] resize-none bg-gray-50 font-mono text-lg"
            />
            {outputText && (
              <div className="mt-2 text-sm text-gray-500">
                长度: {outputText.length} 字符 | 算法: {algorithm.toUpperCase()}
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

        {/* SHA说明 */}
        <Card>
          <CardHeader>
            <CardTitle>SHA哈希说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              SHA（Secure Hash Algorithm）是一系列密码散列函数，由美国国家安全局设计，
              广泛用于数据完整性验证和数字签名等安全应用。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">算法对比：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>SHA-1：</strong>产生160位（40个十六进制字符）哈希值，速度较快但安全性较低</div>
                <div><strong>SHA-256：</strong>产生256位（64个十六进制字符）哈希值，安全性更高，推荐使用</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">SHA特点：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 不可逆：无法从哈希值反推出原始数据</li>
                <li>• 雪崩效应：输入的微小变化会导致输出的巨大变化</li>
                <li>• 确定性：相同输入总是产生相同输出</li>
                <li>• 抗碰撞：很难找到两个不同输入产生相同输出</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2 text-green-800">安全建议：</h4>
              <p className="text-sm text-green-700">
                对于安全敏感的应用，建议使用SHA-256或更高版本的SHA算法。
                SHA-1已被发现存在理论攻击可能，不建议用于新的安全应用。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShaHash;