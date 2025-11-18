import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hash, 
  Copy, 
  RotateCcw, 
  Calculator,
  Binary,
  Hash as HashIcon,
  Hexagon,
  Info,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

const NumberBaseConverter = () => {
  const [inputValue, setInputValue] = useState('255');
  const [inputBase, setInputBase] = useState<2 | 8 | 10 | 16>(10);
  const [results, setResults] = useState<ConversionResult>({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  });
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // 验证输入是否符合指定进制
  const validateInput = (value: string, base: number): boolean => {
    if (!value.trim()) return false;
    
    const cleanValue = value.replace(/\s/g, '');
    
    switch (base) {
      case 2: // 二进制
        return /^[01]+$/.test(cleanValue);
      case 8: // 八进制
        return /^[0-7]+$/.test(cleanValue);
      case 10: // 十进制
        return /^\d+$/.test(cleanValue);
      case 16: // 十六进制
        return /^[0-9A-Fa-f]+$/.test(cleanValue);
      default:
        return false;
    }
  };

  // 转换数字
  const convertNumber = (value: string, fromBase: number): ConversionResult | null => {
    try {
      const cleanValue = value.replace(/\s/g, '');
      
      if (!validateInput(cleanValue, fromBase)) {
        return null;
      }

      // 转换为十进制
      const decimalValue = parseInt(cleanValue, fromBase);
      
      if (isNaN(decimalValue) || decimalValue < 0) {
        return null;
      }

      // 检查数值范围（JavaScript 安全整数范围）
      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        throw new Error('数值超出安全范围');
      }

      return {
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      };
    } catch (err) {
      return null;
    }
  };

  // 格式化显示数字（添加分隔符）
  const formatNumber = (value: string, base: number): string => {
    if (!value) return '';
    
    switch (base) {
      case 2: // 二进制，每4位分隔
        return value.replace(/(.{4})/g, '$1 ').trim();
      case 8: // 八进制，每3位分隔
        return value.replace(/(.{3})/g, '$1 ').trim();
      case 10: // 十进制，每3位分隔
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      case 16: // 十六进制，每4位分隔
        return value.replace(/(.{4})/g, '$1 ').trim();
      default:
        return value;
    }
  };

  // 处理输入变化
  useEffect(() => {
    if (!inputValue.trim()) {
      setResults({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: ''
      });
      setError('');
      return;
    }

    const result = convertNumber(inputValue, inputBase);
    
    if (result) {
      setResults(result);
      setError('');
    } else {
      setError(getErrorMessage(inputBase));
      setResults({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: ''
      });
    }
  }, [inputValue, inputBase]);

  // 获取错误信息
  const getErrorMessage = (base: number): string => {
    switch (base) {
      case 2:
        return '请输入有效的二进制数字（只能包含0和1）';
      case 8:
        return '请输入有效的八进制数字（只能包含0-7）';
      case 10:
        return '请输入有效的十进制数字（只能包含0-9）';
      case 16:
        return '请输入有效的十六进制数字（只能包含0-9和A-F）';
      default:
        return '输入格式错误';
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (value: string, type: string) => {
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  // 清空输入
  const clearInput = () => {
    setInputValue('');
    setError('');
  };

  // 预设示例
  const examples = [
    { value: '255', base: 10, description: '十进制255' },
    { value: 'FF', base: 16, description: '十六进制FF' },
    { value: '11111111', base: 2, description: '二进制11111111' },
    { value: '377', base: 8, description: '八进制377' },
    { value: '1024', base: 10, description: '十进制1024' },
    { value: '400', base: 16, description: '十六进制400' }
  ];

  // 设置示例
  const setExample = (value: string, base: 2 | 8 | 10 | 16) => {
    setInputValue(value);
    setInputBase(base);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold">进制转换器</h1>
            <Badge variant="secondary">转换工具</Badge>
          </div>
          <p className="text-gray-600">支持二进制、八进制、十进制、十六进制之间的相互转换</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区域 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  输入数字
                </CardTitle>
                <CardDescription>
                  选择进制并输入要转换的数字
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 进制选择 */}
                <div>
                  <Label htmlFor="base-select">输入进制</Label>
                  <Tabs value={inputBase.toString()} onValueChange={(value) => setInputBase(parseInt(value) as 2 | 8 | 10 | 16)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="2" className="text-xs">二进制</TabsTrigger>
                      <TabsTrigger value="8" className="text-xs">八进制</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-2 mt-2">
                      <TabsTrigger value="10" className="text-xs">十进制</TabsTrigger>
                      <TabsTrigger value="16" className="text-xs">十六进制</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* 数字输入 */}
                <div>
                  <Label htmlFor="number-input">
                    数字 ({inputBase === 2 ? '二' : inputBase === 8 ? '八' : inputBase === 10 ? '十' : '十六'}进制)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="number-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                      placeholder={
                        inputBase === 2 ? '例如: 11111111' :
                        inputBase === 8 ? '例如: 377' :
                        inputBase === 10 ? '例如: 255' :
                        '例如: FF'
                      }
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={clearInput}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 错误提示 */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* 示例 */}
                <div>
                  <Label>快速示例</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setExample(example.value, example.base)}
                        className="justify-start text-xs"
                      >
                        {example.description}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 转换结果 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HashIcon className="w-5 h-5" />
                  转换结果
                </CardTitle>
                <CardDescription>
                  各进制的转换结果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 二进制 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Binary className="w-4 h-4 text-blue-500" />
                      <Label className="font-semibold">二进制 (Base 2)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={results.binary ? formatNumber(results.binary, 2) : ''}
                        readOnly
                        placeholder="转换结果将显示在这里"
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(results.binary, '二进制结果')}
                        disabled={!results.binary}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {results.binary && (
                      <p className="text-xs text-gray-500">
                        长度: {results.binary.length} 位
                      </p>
                    )}
                  </div>

                  {/* 八进制 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HashIcon className="w-4 h-4 text-orange-500" />
                      <Label className="font-semibold">八进制 (Base 8)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={results.octal ? formatNumber(results.octal, 8) : ''}
                        readOnly
                        placeholder="转换结果将显示在这里"
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(results.octal, '八进制结果')}
                        disabled={!results.octal}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {results.octal && (
                      <p className="text-xs text-gray-500">
                        长度: {results.octal.length} 位
                      </p>
                    )}
                  </div>

                  {/* 十进制 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-green-500" />
                      <Label className="font-semibold">十进制 (Base 10)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={results.decimal ? formatNumber(results.decimal, 10) : ''}
                        readOnly
                        placeholder="转换结果将显示在这里"
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(results.decimal, '十进制结果')}
                        disabled={!results.decimal}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {results.decimal && (
                      <p className="text-xs text-gray-500">
                        数值: {parseInt(results.decimal).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* 十六进制 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hexagon className="w-4 h-4 text-purple-500" />
                      <Label className="font-semibold">十六进制 (Base 16)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={results.hexadecimal ? formatNumber(results.hexadecimal, 16) : ''}
                        readOnly
                        placeholder="转换结果将显示在这里"
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(results.hexadecimal, '十六进制结果')}
                        disabled={!results.hexadecimal}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {results.hexadecimal && (
                      <p className="text-xs text-gray-500">
                        长度: {results.hexadecimal.length} 位
                      </p>
                    )}
                  </div>
                </div>

                {/* 转换信息 */}
                {results.decimal && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">转换信息</p>
                        <p className="text-blue-600 dark:text-blue-400">
                          十进制 {results.decimal} = 二进制 {results.binary} = 八进制 {results.octal} = 十六进制 {results.hexadecimal}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 mt-1">
                          二进制位数: {results.binary.length} | 最大值: {Math.pow(2, results.binary.length) - 1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>
              进制转换器的功能介绍和使用技巧
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">支持的进制</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>二进制 (Base 2)</strong>: 只能包含 0 和 1</li>
                  <li>• <strong>八进制 (Base 8)</strong>: 只能包含 0-7</li>
                  <li>• <strong>十进制 (Base 10)</strong>: 只能包含 0-9</li>
                  <li>• <strong>十六进制 (Base 16)</strong>: 包含 0-9 和 A-F</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">使用技巧</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 输入时会自动验证格式是否正确</li>
                  <li>• 结果会自动添加分隔符便于阅读</li>
                  <li>• 点击复制按钮可复制结果到剪贴板</li>
                  <li>• 支持大小写字母（自动转换为大写）</li>
                  <li>• 最大支持 JavaScript 安全整数范围</li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-semibold mb-2">常用转换对照</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">十进制</th>
                      <th className="text-left p-2">二进制</th>
                      <th className="text-left p-2">八进制</th>
                      <th className="text-left p-2">十六进制</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    <tr className="border-b">
                      <td className="p-2">0</td>
                      <td className="p-2">0</td>
                      <td className="p-2">0</td>
                      <td className="p-2">0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">15</td>
                      <td className="p-2">1111</td>
                      <td className="p-2">17</td>
                      <td className="p-2">F</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">255</td>
                      <td className="p-2">1111 1111</td>
                      <td className="p-2">377</td>
                      <td className="p-2">FF</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1024</td>
                      <td className="p-2">100 0000 0000</td>
                      <td className="p-2">2000</td>
                      <td className="p-2">400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NumberBaseConverter;