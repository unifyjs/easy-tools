import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Copy, RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [selectedExample, setSelectedExample] = useState('');
  const { toast } = useToast();

  // 正则表达式匹配结果
  const matchResults = useMemo(() => {
    if (!pattern || !testString) return { matches: [], isValid: true, error: null };

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches: MatchResult[] = [];

      if (flags.global) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // 防止无限循环
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      return { matches, isValid: true, error: null };
    } catch (error: any) {
      return { matches: [], isValid: false, error: error.message };
    }
  }, [pattern, testString, flags]);

  // 高亮显示匹配结果
  const highlightedText = useMemo(() => {
    if (!testString || matchResults.matches.length === 0) return testString;

    let result = testString;
    let offset = 0;

    matchResults.matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlightedMatch = `<mark class="bg-yellow-200 px-1 rounded" data-match="${index}">${match.match}</mark>`;
      result = result.slice(0, start) + highlightedMatch + result.slice(end);
      offset += highlightedMatch.length - match.match.length;
    });

    return result;
  }, [testString, matchResults.matches]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setSelectedExample('');
  };

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  // 常用正则表达式示例
  const regexExamples = [
    {
      name: '邮箱地址',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      testString: 'user@example.com\ninvalid-email\ntest.email+tag@domain.co.uk',
      description: '验证邮箱地址格式'
    },
    {
      name: '手机号码',
      pattern: '^1[3-9]\\d{9}$',
      testString: '13812345678\n12345678901\n15987654321\n10123456789',
      description: '验证中国大陆手机号码'
    },
    {
      name: 'URL链接',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      testString: 'https://www.example.com\nhttp://test.org/path?param=value\nftp://invalid.com\nhttps://sub.domain.co.uk/page#section',
      description: '匹配HTTP/HTTPS URL'
    },
    {
      name: 'IP地址',
      pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      testString: '192.168.1.1\n255.255.255.255\n256.1.1.1\n192.168.0.256\n10.0.0.1',
      description: '验证IPv4地址格式'
    },
    {
      name: '身份证号',
      pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
      testString: '110101199003077777\n123456789012345678\n11010119900307777X\n110101190003077777',
      description: '验证18位身份证号码'
    },
    {
      name: '中文字符',
      pattern: '[\\u4e00-\\u9fa5]+',
      testString: '这是中文字符\nHello 世界\n123中文456\nEnglish Text',
      description: '匹配中文字符'
    },
    {
      name: '数字提取',
      pattern: '\\d+',
      testString: 'Price: $123.45\nPhone: 13812345678\nYear: 2023\nNo numbers here!',
      description: '提取所有数字'
    },
    {
      name: 'HTML标签',
      pattern: '<[^>]+>',
      testString: '<div class="container">Hello <span>World</span></div>\n<img src="image.jpg" alt="test">\nPlain text without tags',
      description: '匹配HTML标签'
    },
    {
      name: '密码强度',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      testString: 'Password123!\npassword\nPASSWORD\nPass123\nMyP@ssw0rd\n12345678',
      description: '至少8位，包含大小写字母、数字和特殊字符'
    },
    {
      name: '日期格式',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      testString: '2023-12-25\n2023/12/25\n25-12-2023\n2023-1-1\n2023-12-31',
      description: '匹配YYYY-MM-DD格式日期'
    }
  ];

  const handleExampleSelect = (exampleName: string) => {
    const example = regexExamples.find(ex => ex.name === exampleName);
    if (example) {
      setPattern(example.pattern);
      setTestString(example.testString);
      setSelectedExample(exampleName);
      // 根据示例设置合适的标志
      if (exampleName === '数字提取' || exampleName === 'HTML标签' || exampleName === '中文字符') {
        setFlags(prev => ({ ...prev, global: true }));
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold">正则表达式测试工具</h1>
          </div>
          <p className="text-gray-600">
            测试和验证正则表达式，支持实时匹配预览和多种标志选项
          </p>
          <Badge variant="secondary" className="mt-2">文本工具</Badge>
        </div>

        {/* 示例选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>常用正则表达式示例</CardTitle>
            <CardDescription>选择示例快速开始测试</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedExample} onValueChange={handleExampleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="选择一个示例..." />
              </SelectTrigger>
              <SelectContent>
                {regexExamples.map((example) => (
                  <SelectItem key={example.name} value={example.name}>
                    {example.name} - {example.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 正则表达式输入 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  正则表达式
                  {matchResults.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  输入要测试的正则表达式模式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">/</span>
                  <Input
                    placeholder="输入正则表达式..."
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="pl-8 pr-12 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">
                    /{Object.entries(flags).filter(([_, enabled]) => enabled).map(([flag, _]) => {
                      switch (flag) {
                        case 'global': return 'g';
                        case 'ignoreCase': return 'i';
                        case 'multiline': return 'm';
                        case 'dotAll': return 's';
                        case 'unicode': return 'u';
                        case 'sticky': return 'y';
                        default: return '';
                      }
                    }).join('')}
                  </span>
                </div>
                
                {!matchResults.isValid && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">正则表达式错误</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{matchResults.error}</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => handleCopy(pattern)}
                  disabled={!pattern}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制正则表达式
                </Button>
              </CardContent>
            </Card>

            {/* 标志选项 */}
            <Card>
              <CardHeader>
                <CardTitle>正则表达式标志</CardTitle>
                <CardDescription>选择正则表达式的匹配选项</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="global"
                      checked={flags.global}
                      onCheckedChange={() => handleFlagChange('global')}
                    />
                    <label htmlFor="global" className="text-sm font-medium">
                      全局匹配 (g)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ignoreCase"
                      checked={flags.ignoreCase}
                      onCheckedChange={() => handleFlagChange('ignoreCase')}
                    />
                    <label htmlFor="ignoreCase" className="text-sm font-medium">
                      忽略大小写 (i)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multiline"
                      checked={flags.multiline}
                      onCheckedChange={() => handleFlagChange('multiline')}
                    />
                    <label htmlFor="multiline" className="text-sm font-medium">
                      多行模式 (m)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dotAll"
                      checked={flags.dotAll}
                      onCheckedChange={() => handleFlagChange('dotAll')}
                    />
                    <label htmlFor="dotAll" className="text-sm font-medium">
                      点号匹配所有 (s)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unicode"
                      checked={flags.unicode}
                      onCheckedChange={() => handleFlagChange('unicode')}
                    />
                    <label htmlFor="unicode" className="text-sm font-medium">
                      Unicode (u)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sticky"
                      checked={flags.sticky}
                      onCheckedChange={() => handleFlagChange('sticky')}
                    />
                    <label htmlFor="sticky" className="text-sm font-medium">
                      粘性匹配 (y)
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 测试文本和结果 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>测试文本</CardTitle>
                <CardDescription>输入要测试的文本内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="输入要测试的文本..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(testString)}
                    disabled={!testString}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制文本
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 匹配结果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  匹配结果
                  <Badge variant={matchResults.matches.length > 0 ? "default" : "secondary"}>
                    {matchResults.matches.length} 个匹配
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pattern && testString && matchResults.isValid ? (
                  <div className="space-y-4">
                    {/* 高亮显示 */}
                    <div>
                      <h4 className="font-medium mb-2">高亮显示</h4>
                      <div 
                        className="p-3 bg-gray-50 rounded-lg border font-mono text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </div>

                    {/* 匹配详情 */}
                    {matchResults.matches.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">匹配详情</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {matchResults.matches.map((match, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-blue-700">匹配 #{index + 1}</span>
                                <Badge variant="outline">位置: {match.index}</Badge>
                              </div>
                              <div className="font-mono text-sm">
                                <div className="mb-1">
                                  <span className="text-gray-600">匹配内容: </span>
                                  <span className="bg-yellow-200 px-1 rounded">{match.match}</span>
                                </div>
                                {match.groups.length > 0 && (
                                  <div>
                                    <span className="text-gray-600">捕获组: </span>
                                    {match.groups.map((group, groupIndex) => (
                                      <span key={groupIndex} className="bg-green-200 px-1 rounded mr-1">
                                        ${groupIndex + 1}: {group || '(空)'}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="w-8 h-8 mx-auto mb-2" />
                    <p>输入正则表达式和测试文本开始测试</p>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">正则表达式标志说明</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div><strong>g (全局)</strong>: 查找所有匹配项，而不是第一个</div>
                <div><strong>i (忽略大小写)</strong>: 不区分大小写匹配</div>
                <div><strong>m (多行)</strong>: ^ 和 $ 匹配每行的开始和结束</div>
                <div><strong>s (点号匹配所有)</strong>: . 匹配包括换行符在内的所有字符</div>
                <div><strong>u (Unicode)</strong>: 启用Unicode模式</div>
                <div><strong>y (粘性)</strong>: 从lastIndex位置开始匹配</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">常用正则表达式元字符</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 font-mono">
                <div>. - 任意字符</div>
                <div>* - 0次或多次</div>
                <div>+ - 1次或多次</div>
                <div>? - 0次或1次</div>
                <div>^ - 行开始</div>
                <div>$ - 行结束</div>
                <div>\\d - 数字</div>
                <div>\\w - 字母数字</div>
                <div>\\s - 空白字符</div>
                <div>[abc] - 字符集</div>
                <div>(abc) - 捕获组</div>
                <div>(?:abc) - 非捕获组</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用技巧</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 使用示例快速学习常用正则表达式</li>
                <li>• 实时查看匹配结果和高亮显示</li>
                <li>• 捕获组用于提取特定部分的内容</li>
                <li>• 测试复杂表达式时建议先从简单开始</li>
                <li>• 注意转义特殊字符（如 . * + ? ^ $ | \ ( ) [ ]）</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegexTester;