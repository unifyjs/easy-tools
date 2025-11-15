import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GitCompare, Copy, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Diff from 'diff';

type DiffMode = 'chars' | 'words' | 'lines' | 'sentences';

interface DiffResult {
  added?: boolean;
  removed?: boolean;
  value: string;
  count?: number;
}

const TextDiff = () => {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [diffMode, setDiffMode] = useState<DiffMode>('lines');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState('input');
  const { toast } = useToast();

  // 计算差异
  const diffResult = useMemo(() => {
    if (!originalText && !modifiedText) return [];

    let text1 = originalText;
    let text2 = modifiedText;

    // 处理忽略选项
    if (ignoreCase) {
      text1 = text1.toLowerCase();
      text2 = text2.toLowerCase();
    }

    if (ignoreWhitespace) {
      text1 = text1.replace(/\s+/g, ' ').trim();
      text2 = text2.replace(/\s+/g, ' ').trim();
    }

    // 根据模式计算差异
    let diff: DiffResult[] = [];
    switch (diffMode) {
      case 'chars':
        diff = Diff.diffChars(text1, text2);
        break;
      case 'words':
        diff = Diff.diffWords(text1, text2);
        break;
      case 'lines':
        diff = Diff.diffLines(text1, text2);
        break;
      case 'sentences':
        diff = Diff.diffSentences(text1, text2);
        break;
    }

    return diff;
  }, [originalText, modifiedText, diffMode, ignoreCase, ignoreWhitespace]);

  // 统计信息
  const stats = useMemo(() => {
    const added = diffResult.filter(part => part.added).length;
    const removed = diffResult.filter(part => part.removed).length;
    const unchanged = diffResult.filter(part => !part.added && !part.removed).length;
    
    return { added, removed, unchanged, total: diffResult.length };
  }, [diffResult]);

  // 渲染差异结果
  const renderDiffResult = () => {
    if (diffResult.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>请输入要比较的文本内容</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {diffResult.map((part, index) => {
          let className = 'p-2 rounded border-l-4 ';
          let bgColor = '';
          let borderColor = '';
          
          if (part.added) {
            className += 'bg-green-50 border-green-400 text-green-800';
            bgColor = 'bg-green-50';
            borderColor = 'border-green-400';
          } else if (part.removed) {
            className += 'bg-red-50 border-red-400 text-red-800';
            bgColor = 'bg-red-50';
            borderColor = 'border-red-400';
          } else {
            className += 'bg-gray-50 border-gray-300 text-gray-700';
            bgColor = 'bg-gray-50';
            borderColor = 'border-gray-300';
          }

          const lines = part.value.split('\n');
          
          return (
            <div key={index} className={`${bgColor} ${borderColor} border-l-4 rounded`}>
              {lines.map((line, lineIndex) => (
                <div key={lineIndex} className="flex">
                  {showLineNumbers && (
                    <div className="w-12 text-xs text-gray-400 pr-2 text-right flex-shrink-0">
                      {line.trim() && (lineIndex + 1)}
                    </div>
                  )}
                  <div className={`flex-1 p-2 ${part.added ? 'text-green-800' : part.removed ? 'text-red-800' : 'text-gray-700'}`}>
                    {part.added && <span className="text-green-600 mr-1">+</span>}
                    {part.removed && <span className="text-red-600 mr-1">-</span>}
                    <span className="font-mono text-sm whitespace-pre-wrap">{line}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染并排视图
  const renderSideBySideView = () => {
    const originalLines = originalText.split('\n');
    const modifiedLines = modifiedText.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
            原始文本
          </h3>
          <div className="border rounded-lg bg-gray-50 max-h-96 overflow-auto">
            {Array.from({ length: maxLines }, (_, i) => (
              <div key={i} className="flex border-b border-gray-200 last:border-b-0">
                {showLineNumbers && (
                  <div className="w-12 text-xs text-gray-400 p-2 bg-gray-100 border-r">
                    {originalLines[i] !== undefined ? i + 1 : ''}
                  </div>
                )}
                <div className="flex-1 p-2 font-mono text-sm whitespace-pre-wrap">
                  {originalLines[i] || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            修改后文本
          </h3>
          <div className="border rounded-lg bg-gray-50 max-h-96 overflow-auto">
            {Array.from({ length: maxLines }, (_, i) => (
              <div key={i} className="flex border-b border-gray-200 last:border-b-0">
                {showLineNumbers && (
                  <div className="w-12 text-xs text-gray-400 p-2 bg-gray-100 border-r">
                    {modifiedLines[i] !== undefined ? i + 1 : ''}
                  </div>
                )}
                <div className="flex-1 p-2 font-mono text-sm whitespace-pre-wrap">
                  {modifiedLines[i] || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 复制结果
  const copyResult = () => {
    const result = diffResult.map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').map(line => prefix + line).join('\n');
    }).join('\n');

    navigator.clipboard.writeText(result).then(() => {
      toast({
        title: "复制成功",
        description: "差异结果已复制到剪贴板",
      });
    });
  };

  // 导出结果
  const exportResult = () => {
    const result = diffResult.map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').map(line => prefix + line).join('\n');
    }).join('\n');

    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-diff-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "导出成功",
      description: "差异结果已导出为文件",
    });
  };

  // 清空内容
  const clearAll = () => {
    setOriginalText('');
    setModifiedText('');
    setActiveTab('input');
  };

  // 示例文本
  const loadExample = () => {
    setOriginalText(`Hello World!
This is the original text.
It has multiple lines.
Some content here.
End of original text.`);

    setModifiedText(`Hello World!
This is the modified text.
It has multiple lines with changes.
Some new content here.
Additional line added.
End of modified text.`);

    setActiveTab('unified');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GitCompare className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">文本对比工具</h1>
              <p className="text-gray-600">比较两个文本的差异，高亮显示不同之处</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">文本工具</Badge>
        </div>

        {/* 控制面板 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">比较设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="diff-mode" className="text-sm font-medium">比较模式</Label>
                <Select value={diffMode} onValueChange={(value: DiffMode) => setDiffMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lines">按行比较</SelectItem>
                    <SelectItem value="words">按词比较</SelectItem>
                    <SelectItem value="chars">按字符比较</SelectItem>
                    <SelectItem value="sentences">按句子比较</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-case"
                  checked={ignoreCase}
                  onCheckedChange={setIgnoreCase}
                />
                <Label htmlFor="ignore-case" className="text-sm">忽略大小写</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-whitespace"
                  checked={ignoreWhitespace}
                  onCheckedChange={setIgnoreWhitespace}
                />
                <Label htmlFor="ignore-whitespace" className="text-sm">忽略空白字符</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-line-numbers"
                  checked={showLineNumbers}
                  onCheckedChange={setShowLineNumbers}
                />
                <Label htmlFor="show-line-numbers" className="text-sm">显示行号</Label>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={loadExample} variant="outline" size="sm">
                加载示例
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                清空
              </Button>
              <Button onClick={copyResult} variant="outline" size="sm" disabled={diffResult.length === 0}>
                <Copy className="w-4 h-4 mr-1" />
                复制结果
              </Button>
              <Button onClick={exportResult} variant="outline" size="sm" disabled={diffResult.length === 0}>
                <Download className="w-4 h-4 mr-1" />
                导出结果
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        {diffResult.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                  <div className="text-sm text-gray-600">新增</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                  <div className="text-sm text-gray-600">删除</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
                  <div className="text-sm text-gray-600">未变更</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">总计</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">文本输入</TabsTrigger>
            <TabsTrigger value="unified">统一视图</TabsTrigger>
            <TabsTrigger value="side-by-side">并排视图</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                    原始文本
                  </CardTitle>
                  <CardDescription>
                    输入要比较的原始文本内容
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="请输入原始文本..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                    修改后文本
                  </CardTitle>
                  <CardDescription>
                    输入修改后的文本内容
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="请输入修改后的文本..."
                    value={modifiedText}
                    onChange={(e) => setModifiedText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="unified" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">统一差异视图</CardTitle>
                <CardDescription>
                  以统一格式显示文本差异，绿色表示新增，红色表示删除
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto border rounded-lg p-4 bg-gray-50">
                  {renderDiffResult()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="side-by-side" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">并排对比视图</CardTitle>
                <CardDescription>
                  并排显示原始文本和修改后的文本
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSideBySideView()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TextDiff;