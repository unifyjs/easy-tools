import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Base64Encoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
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
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch (error) {
      toast({
        title: "解码失败",
        description: "请检查输入的Base64字符串是否正确",
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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}

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
                编码 (Encode)
              </Button>
              <Button
                variant={mode === 'decode' ? 'default' : 'outline'}
                onClick={() => setMode('decode')}
              >
                解码 (Decode)
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
              {mode === 'encode' ? '原始文本' : 'Base64字符串'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '输入要编码的原始文本' 
                : '输入要解码的Base64字符串'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === 'encode' 
                ? '请输入要编码的文本...' 
                : '请输入要解码的Base64字符串...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none"
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
              {mode === 'encode' ? 'Base64结果' : '解码结果'}
            </CardTitle>
            <CardDescription>
              {mode === 'encode' 
                ? '编码后的Base64字符串' 
                : '解码后的原始文本'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="结果将显示在这里..."
              value={outputText}
              readOnly
              className="min-h-[150px] resize-none bg-gray-50"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Base64说明 */}
        <Card>
          <CardHeader>
            <CardTitle>Base64编码说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Base64编码要求把3个8位字节（3×8=24）转化为4个6位的字节（4×6=24），
              之后在6位的前面补两个0，形成8位一个字节的形式。如果剩下的字符不足3个字节，
              则用0填充，输出字符使用'='，因此编码后输出的文本末尾可能会出现1或2个'='。
            </p>
            <p className="text-gray-600">
              为了保证所输出的编码位可读字符，Base64制定了一个编码表，以便进行统一转换。
              编码表的大小为2^6=64，这也是Base64名称的由来。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Base64字符集：</h4>
              <p className="text-sm text-gray-600 font-mono">
                A-Z (0-25), a-z (26-51), 0-9 (52-61), + (62), / (63), = (填充字符)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Base64Encoder;