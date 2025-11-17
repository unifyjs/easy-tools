import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Code, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SqlFormatter = () => {
  const [inputSql, setInputSql] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [isMinified, setIsMinified] = useState(false);
  const { toast } = useToast();

  const formatSql = (sql: string, minify: boolean = false): string => {
    if (!sql.trim()) return '';

    if (minify) {
      return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*([(),;])\s*/g, '$1')
        .trim();
    }

    // 基本的SQL格式化逻辑
    let formatted = sql
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|GROUP BY|ORDER BY|HAVING|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/gi, '\n$1')
      .replace(/\b(AND|OR)\b/gi, '\n  $1')
      .replace(/,/g, ',\n  ')
      .replace(/\(/g, '(\n  ')
      .replace(/\)/g, '\n)')
      .replace(/;/g, ';\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // 简单的缩进处理
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      if (line.includes(')')) indentLevel = Math.max(0, indentLevel - 1);
      const indentedLine = '  '.repeat(indentLevel) + line;
      if (line.includes('(')) indentLevel++;
      return indentedLine;
    });

    return indentedLines.join('\n');
  };

  const handleFormat = () => {
    if (!inputSql.trim()) {
      toast({
        title: "输入为空",
        description: "请输入SQL语句",
        variant: "destructive",
      });
      return;
    }

    try {
      const formatted = formatSql(inputSql, isMinified);
      setFormattedSql(formatted);
      toast({
        title: "格式化成功",
        description: isMinified ? "SQL已压缩" : "SQL已格式化",
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: "处理SQL时出错：" + error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!formattedSql) {
      toast({
        title: "无内容可复制",
        description: "请先格式化SQL",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedSql);
      toast({
        title: "复制成功",
        description: "已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputSql('');
    setFormattedSql('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SQL格式化器</h1>
        <p className="text-muted-foreground">
          格式化和美化SQL语句，提高代码可读性，支持压缩模式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              输入SQL
            </CardTitle>
            <CardDescription>
              粘贴或输入需要格式化的SQL语句
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="输入SQL语句..."
              value={inputSql}
              onChange={(e) => setInputSql(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleFormat} className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {isMinified ? '压缩' : '格式化'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsMinified(!isMinified)}
                className="flex items-center gap-2"
              >
                {isMinified ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                {isMinified ? '美化模式' : '压缩模式'}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              格式化结果
              {formattedSql && (
                <Badge variant="secondary" className="ml-2">
                  {formattedSql.split('\n').length} 行
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              格式化后的SQL语句
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={formattedSql}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="格式化结果将显示在这里..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!formattedSql}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">支持的功能：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• SQL语句格式化和美化</li>
                <li>• 关键字大写转换</li>
                <li>• 自动缩进和换行</li>
                <li>• 压缩模式去除多余空格</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">支持的SQL类型：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• SELECT查询语句</li>
                <li>• INSERT插入语句</li>
                <li>• UPDATE更新语句</li>
                <li>• DELETE删除语句</li>
                <li>• CREATE建表语句</li>
                <li>• 复杂的JOIN查询</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SqlFormatter;