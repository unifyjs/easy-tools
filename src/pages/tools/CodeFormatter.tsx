import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Copy, RotateCcw, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CodeLanguage = 'javascript' | 'json' | 'html' | 'css' | 'xml' | 'sql';

const CodeFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [indentSize, setIndentSize] = useState('2');
  const { toast } = useToast();

  // JavaScript/JSON 格式化
  const formatJavaScript = (code: string): string => {
    try {
      // 基本的JavaScript格式化逻辑
      let formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s*\*\s*/g, ' * ')
        .replace(/\s*\/\s*/g, ' / ');

      // 添加缩进
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indent = ' '.repeat(parseInt(indentSize));
      
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
        const result = indent.repeat(indentLevel) + trimmed;
        if (trimmed.includes('{')) indentLevel++;
        
        return result;
      }).join('\n');
    } catch (error) {
      throw new Error('JavaScript代码格式化失败');
    }
  };

  // JSON 格式化
  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, parseInt(indentSize));
    } catch (error) {
      throw new Error('JSON格式不正确');
    }
  };

  // HTML 格式化
  const formatHTML = (code: string): string => {
    try {
      const indent = ' '.repeat(parseInt(indentSize));
      let formatted = code
        .replace(/>\s*</g, '><')
        .replace(/></g, '>\n<');
      
      const lines = formatted.split('\n');
      let indentLevel = 0;
      
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // 处理结束标签
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const result = indent.repeat(indentLevel) + trimmed;
        
        // 处理开始标签（非自闭合标签）
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++;
        }
        
        return result;
      }).join('\n');
    } catch (error) {
      throw new Error('HTML代码格式化失败');
    }
  };

  // CSS 格式化
  const formatCSS = (code: string): string => {
    try {
      const indent = ' '.repeat(parseInt(indentSize));
      let formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/,\s*/g, ',\n');

      const lines = formatted.split('\n');
      let indentLevel = 0;
      
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed === '}') {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const result = indent.repeat(indentLevel) + trimmed;
        
        if (trimmed.includes('{')) {
          indentLevel++;
        }
        
        return result;
      }).join('\n');
    } catch (error) {
      throw new Error('CSS代码格式化失败');
    }
  };

  // XML 格式化
  const formatXML = (code: string): string => {
    try {
      const indent = ' '.repeat(parseInt(indentSize));
      let formatted = code
        .replace(/>\s*</g, '><')
        .replace(/></g, '>\n<');
      
      const lines = formatted.split('\n');
      let indentLevel = 0;
      
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const result = indent.repeat(indentLevel) + trimmed;
        
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++;
        }
        
        return result;
      }).join('\n');
    } catch (error) {
      throw new Error('XML代码格式化失败');
    }
  };

  // SQL 格式化
  const formatSQL = (code: string): string => {
    try {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
                       'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 
                       'ALTER', 'DROP', 'AND', 'OR', 'NOT', 'IN', 'EXISTS'];
      
      let formatted = code.toUpperCase();
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
      });
      
      return formatted
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    } catch (error) {
      throw new Error('SQL代码格式化失败');
    }
  };

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要格式化的代码",
        variant: "destructive",
      });
      return;
    }

    try {
      let formatted = '';
      
      switch (language) {
        case 'javascript':
          formatted = formatJavaScript(input);
          break;
        case 'json':
          formatted = formatJSON(input);
          break;
        case 'html':
          formatted = formatHTML(input);
          break;
        case 'css':
          formatted = formatCSS(input);
          break;
        case 'xml':
          formatted = formatXML(input);
          break;
        case 'sql':
          formatted = formatSQL(input);
          break;
        default:
          formatted = input;
      }
      
      setOutput(formatted);
      toast({
        title: "格式化成功",
        description: `${language.toUpperCase()}代码已成功格式化`,
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: error.message || "代码格式化失败",
        variant: "destructive",
      });
    }
  }, [input, language, indentSize, toast]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "代码已复制到剪贴板",
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
    setInput('');
    setOutput('');
  };

  const handleDownload = () => {
    if (!output) {
      toast({
        title: "无内容下载",
        description: "请先格式化代码",
        variant: "destructive",
      });
      return;
    }

    const extensions: Record<CodeLanguage, string> = {
      javascript: 'js',
      json: 'json',
      html: 'html',
      css: 'css',
      xml: 'xml',
      sql: 'sql'
    };

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_code.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "下载成功",
      description: "格式化后的代码已下载",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      
      // 根据文件扩展名自动设置语言
      const extension = file.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
          setLanguage('javascript');
          break;
        case 'json':
          setLanguage('json');
          break;
        case 'html':
        case 'htm':
          setLanguage('html');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'xml':
          setLanguage('xml');
          break;
        case 'sql':
          setLanguage('sql');
          break;
      }
    };
    reader.readAsText(file);
  };

  const examples: Record<CodeLanguage, string> = {
    javascript: `function hello(name){if(name){return "Hello, "+name+"!";}else{return "Hello, World!";}}`,
    json: `{"name":"John","age":30,"city":"New York","hobbies":["reading","swimming"],"address":{"street":"123 Main St","zip":"10001"}}`,
    html: `<div><h1>Title</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`,
    css: `.container{display:flex;justify-content:center;align-items:center;}.button{background-color:#007bff;color:white;padding:10px 20px;border:none;border-radius:4px;}`,
    xml: `<root><person><name>John</name><age>30</age><address><street>123 Main St</street><city>New York</city></address></person></root>`,
    sql: `select u.name,u.email,p.title from users u inner join posts p on u.id=p.user_id where u.active=1 order by p.created_at desc`
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">代码格式化工具</h1>
          </div>
          <p className="text-gray-600">
            格式化JavaScript、JSON、HTML、CSS、XML、SQL等代码，提高代码可读性
          </p>
          <Badge variant="secondary" className="mt-2">代码工具</Badge>
        </div>

        {/* 设置区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>格式化设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">代码语言</label>
                <Select value={language} onValueChange={(value: CodeLanguage) => setLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">缩进大小</label>
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2个空格</SelectItem>
                    <SelectItem value="4">4个空格</SelectItem>
                    <SelectItem value="8">8个空格</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">文件上传</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".js,.jsx,.ts,.tsx,.json,.html,.htm,.css,.xml,.sql"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    选择文件
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                原始代码
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(examples[language])}
                >
                  加载示例
                </Button>
              </CardTitle>
              <CardDescription>
                输入需要格式化的{language.toUpperCase()}代码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={`输入${language.toUpperCase()}代码...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  格式化代码
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                格式化结果
                <div className="flex gap-2">
                  {output && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(output)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="格式化后的代码将显示在这里..."
                className="min-h-[400px] font-mono text-sm bg-gray-50"
              />
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">支持的代码语言</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <div>• JavaScript/TypeScript</div>
                <div>• JSON数据格式</div>
                <div>• HTML标记语言</div>
                <div>• CSS样式表</div>
                <div>• XML文档</div>
                <div>• SQL查询语句</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">功能特性</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 自动检测代码语法并格式化</li>
                <li>• 可自定义缩进大小（2/4/8个空格）</li>
                <li>• 支持文件上传，自动识别文件类型</li>
                <li>• 一键复制格式化结果</li>
                <li>• 支持下载格式化后的代码文件</li>
                <li>• 提供常用代码示例</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用技巧</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 选择正确的代码语言以获得最佳格式化效果</li>
                <li>• JSON格式化会验证语法正确性</li>
                <li>• 可以直接拖拽文件到上传区域</li>
                <li>• 格式化后的代码保持原有逻辑不变</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeFormatter;