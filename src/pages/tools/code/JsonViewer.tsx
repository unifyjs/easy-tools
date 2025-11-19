import React, { useState, useRef } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Eye, 
  Code, 
  Minimize2, 
  Maximize2, 
  FileText, 
  Download, 
  Upload, 
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  SortAsc,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonStats {
  totalKeys: number;
  totalValues: number;
  maxDepth: number;
  arrayCount: number;
  objectCount: number;
  nullCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
}

const JsonViewer = () => {
  const [inputText, setInputText] = useState('');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'formatted' | 'compact'>('formatted');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [sortKeys, setSortKeys] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 计算JSON统计信息
  const calculateStats = (obj: any, depth = 0): JsonStats => {
    const stats: JsonStats = {
      totalKeys: 0,
      totalValues: 0,
      maxDepth: depth,
      arrayCount: 0,
      objectCount: 0,
      nullCount: 0,
      stringCount: 0,
      numberCount: 0,
      booleanCount: 0
    };

    if (obj === null) {
      stats.nullCount = 1;
      stats.totalValues = 1;
      return stats;
    }

    if (typeof obj === 'string') {
      stats.stringCount = 1;
      stats.totalValues = 1;
      return stats;
    }

    if (typeof obj === 'number') {
      stats.numberCount = 1;
      stats.totalValues = 1;
      return stats;
    }

    if (typeof obj === 'boolean') {
      stats.booleanCount = 1;
      stats.totalValues = 1;
      return stats;
    }

    if (Array.isArray(obj)) {
      stats.arrayCount = 1;
      stats.totalValues = 1;
      obj.forEach(item => {
        const childStats = calculateStats(item, depth + 1);
        stats.totalKeys += childStats.totalKeys;
        stats.totalValues += childStats.totalValues;
        stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
        stats.arrayCount += childStats.arrayCount;
        stats.objectCount += childStats.objectCount;
        stats.nullCount += childStats.nullCount;
        stats.stringCount += childStats.stringCount;
        stats.numberCount += childStats.numberCount;
        stats.booleanCount += childStats.booleanCount;
      });
      return stats;
    }

    if (typeof obj === 'object') {
      stats.objectCount = 1;
      stats.totalValues = 1;
      Object.entries(obj).forEach(([key, value]) => {
        stats.totalKeys += 1;
        const childStats = calculateStats(value, depth + 1);
        stats.totalKeys += childStats.totalKeys;
        stats.totalValues += childStats.totalValues;
        stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
        stats.arrayCount += childStats.arrayCount;
        stats.objectCount += childStats.objectCount;
        stats.nullCount += childStats.nullCount;
        stats.stringCount += childStats.stringCount;
        stats.numberCount += childStats.numberCount;
        stats.booleanCount += childStats.booleanCount;
      });
      return stats;
    }

    return stats;
  };

  // 移除空值
  const removeEmptyValues = (obj: any): any => {
    if (obj === null || obj === undefined || obj === '') {
      return undefined;
    }

    if (Array.isArray(obj)) {
      const filtered = obj.map(removeEmptyValues).filter(item => item !== undefined);
      return filtered.length > 0 ? filtered : undefined;
    }

    if (typeof obj === 'object') {
      const filtered: any = {};
      Object.entries(obj).forEach(([key, value]) => {
        const cleanValue = removeEmptyValues(value);
        if (cleanValue !== undefined) {
          filtered[key] = cleanValue;
        }
      });
      return Object.keys(filtered).length > 0 ? filtered : undefined;
    }

    return obj;
  };

  // 排序对象键名
  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }

    if (typeof obj === 'object' && obj !== null) {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }

    return obj;
  };

  // 处理JSON数据
  const processJson = (json: any) => {
    let processed = json;
    
    if (removeEmpty) {
      processed = removeEmptyValues(processed);
    }
    
    if (sortKeys) {
      processed = sortObjectKeys(processed);
    }
    
    return processed;
  };

  const handleParse = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入JSON字符串",
        variant: "destructive",
      });
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const processed = processJson(parsed);
      setParsedJson(processed);
      setIsValid(true);
      setStats(calculateStats(processed));
      toast({
        title: "解析成功",
        description: "JSON格式正确",
      });
    } catch (error: any) {
      toast({
        title: "解析失败",
        description: "JSON格式错误：" + error.message,
        variant: "destructive",
      });
      setParsedJson(null);
      setIsValid(false);
      setStats(null);
    }
  };

  // 直接格式化输入的JSON
  const handleDirectFormat = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入JSON字符串",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, 2);
      setInputText(formatted);
      toast({
        title: "格式化成功",
        description: "JSON已格式化",
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: "JSON格式错误：" + error.message,
        variant: "destructive",
      });
    }
  };

  // 直接压缩输入的JSON
  const handleDirectCompress = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入JSON字符串",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const compressed = JSON.stringify(parsed);
      setInputText(compressed);
      toast({
        title: "压缩成功",
        description: "JSON已压缩",
      });
    } catch (error: any) {
      toast({
        title: "压缩失败",
        description: "JSON格式错误：" + error.message,
        variant: "destructive",
      });
    }
  };

  // 直接转义输入的JSON
  const handleDirectEscape = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入JSON字符串",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, 2);
      const escaped = JSON.stringify(formatted);
      setInputText(escaped);
      toast({
        title: "转义成功",
        description: "JSON已转义",
      });
    } catch (error: any) {
      toast({
        title: "转义失败",
        description: "JSON格式错误：" + error.message,
        variant: "destructive",
      });
    }
  };

  // 直接去除转义
  const handleDirectUnescape = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入内容",
        variant: "destructive",
      });
      return;
    }

    try {
      const unescaped = JSON.parse(inputText);
      if (typeof unescaped === 'string') {
        // 如果解析后是字符串，尝试再次解析为JSON
        try {
          const parsed = JSON.parse(unescaped);
          const formatted = JSON.stringify(parsed, null, 2);
          setInputText(formatted);
        } catch {
          // 如果不是JSON字符串，直接设置为去转义后的字符串
          setInputText(unescaped);
        }
      } else {
        const formatted = JSON.stringify(unescaped, null, 2);
        setInputText(formatted);
      }
      toast({
        title: "去转义成功",
        description: "内容已去转义",
      });
    } catch (error: any) {
      toast({
        title: "去转义失败",
        description: "格式错误：" + error.message,
        variant: "destructive",
      });
    }
  };

  // 格式化JSON
  const formatJson = () => {
    if (!parsedJson) return '';
    return JSON.stringify(parsedJson, null, 2);
  };

  // 压缩JSON
  const compressJson = () => {
    if (!parsedJson) return '';
    return JSON.stringify(parsedJson);
  };

  // 转义JSON
  const escapeJson = () => {
    if (!parsedJson) return '';
    const formatted = JSON.stringify(parsedJson, null, 2);
    return JSON.stringify(formatted);
  };

  // 去除转义
  const unescapeJson = () => {
    try {
      const unescaped = JSON.parse(inputText);
      if (typeof unescaped === 'string') {
        return unescaped;
      }
      return JSON.stringify(unescaped, null, 2);
    } catch (error) {
      return '无法去除转义：格式错误';
    }
  };

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
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
    setParsedJson(null);
    setIsValid(null);
    setStats(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderJsonTree = (obj: any, level = 0): React.ReactNode => {
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (typeof obj === 'string') return <span className="text-green-600">"{obj}"</span>;
    if (typeof obj === 'number') return <span className="text-blue-600">{obj}</span>;
    if (typeof obj === 'boolean') return <span className="text-purple-600">{obj.toString()}</span>;

    if (Array.isArray(obj)) {
      return (
        <div className={`ml-${level * 4}`}>
          <span className="text-gray-700">[</span>
          {obj.map((item, index) => (
            <div key={index} className="ml-4">
              {renderJsonTree(item, level + 1)}
              {index < obj.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          <span className="text-gray-700">]</span>
        </div>
      );
    }

    if (typeof obj === 'object') {
      return (
        <div className={`ml-${level * 4}`}>
          <span className="text-gray-700">{'{'}</span>
          {Object.entries(obj).map(([key, value], index, arr) => (
            <div key={key} className="ml-4">
              <span className="text-red-600">"{key}"</span>
              <span className="text-gray-700">: </span>
              {renderJsonTree(value, level + 1)}
              {index < arr.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          <span className="text-gray-700">{'}'}</span>
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <>
      <SEOHead toolId="json-viewer" />
      <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  JSON工具箱
                  {isValid !== null && (
                    isValid ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> : 
                      <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription>强大的JSON处理工具，支持格式化、压缩、转义等多种功能</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  导入文件
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='请输入JSON字符串，例如：{"name": "张三", "age": 25, "skills": ["JavaScript", "React"]}'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-none font-mono text-sm"
            />
            
            {/* 处理选项 */}
            <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sort-keys"
                  checked={sortKeys}
                  onCheckedChange={setSortKeys}
                />
                <Label htmlFor="sort-keys" className="text-sm">排序键名</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-empty"
                  checked={removeEmpty}
                  onCheckedChange={setRemoveEmpty}
                />
                <Label htmlFor="remove-empty" className="text-sm">移除空值</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-stats"
                  checked={showStats}
                  onCheckedChange={setShowStats}
                />
                <Label htmlFor="show-stats" className="text-sm">显示统计</Label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleParse}>
                <Code className="w-4 h-4 mr-2" />
                解析JSON
              </Button>
              <Button variant="outline" onClick={handleDirectFormat}>
                <Maximize2 className="w-4 h-4 mr-2" />
                格式化
              </Button>
              <Button variant="outline" onClick={handleDirectCompress}>
                <Minimize2 className="w-4 h-4 mr-2" />
                压缩
              </Button>
              <Button variant="outline" onClick={handleDirectEscape}>
                <FileText className="w-4 h-4 mr-2" />
                转义
              </Button>
              <Button variant="outline" onClick={handleDirectUnescape}>
                <Eye className="w-4 h-4 mr-2" />
                去转义
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        {stats && showStats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                JSON统计信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalKeys}</div>
                  <div className="text-sm text-gray-600">总键数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalValues}</div>
                  <div className="text-sm text-gray-600">总值数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.maxDepth}</div>
                  <div className="text-sm text-gray-600">最大深度</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.objectCount}</div>
                  <div className="text-sm text-gray-600">对象数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.arrayCount}</div>
                  <div className="text-sm text-gray-600">数组数</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Badge variant="secondary">字符串: {stats.stringCount}</Badge>
                <Badge variant="secondary">数字: {stats.numberCount}</Badge>
                <Badge variant="secondary">布尔: {stats.booleanCount}</Badge>
                <Badge variant="secondary">空值: {stats.nullCount}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 结果区域 */}
        {parsedJson && (
          <Card>
            <CardHeader>
              <CardTitle>处理结果</CardTitle>
              <CardDescription>选择不同的输出格式和操作</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="formatted">格式化</TabsTrigger>
                  <TabsTrigger value="compressed">压缩</TabsTrigger>
                  <TabsTrigger value="escaped">转义</TabsTrigger>
                  <TabsTrigger value="unescaped">去转义</TabsTrigger>
                  <TabsTrigger value="tree">树形</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">格式化JSON</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(formatJson(), '格式化JSON')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(formatJson(), 'formatted.json')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={formatJson()}
                    readOnly
                    className="min-h-[400px] resize-none bg-gray-50 font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="compressed" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">压缩JSON</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(compressJson(), '压缩JSON')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(compressJson(), 'compressed.json')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={compressJson()}
                    readOnly
                    className="min-h-[400px] resize-none bg-gray-50 font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="escaped" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">转义JSON</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(escapeJson(), '转义JSON')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(escapeJson(), 'escaped.json')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={escapeJson()}
                    readOnly
                    className="min-h-[400px] resize-none bg-gray-50 font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="unescaped" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">去除转义</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(unescapeJson(), '去转义JSON')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(unescapeJson(), 'unescaped.json')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={unescapeJson()}
                    readOnly
                    className="min-h-[400px] resize-none bg-gray-50 font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="tree" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">树形视图</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(formatJson(), '树形JSON')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制JSON
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[400px] overflow-auto font-mono text-sm border">
                    {renderJsonTree(parsedJson)}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default JsonViewer;