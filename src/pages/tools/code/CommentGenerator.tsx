import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, MessageSquare, Code, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CommentStyle = 'jsdoc' | 'python' | 'java' | 'csharp' | 'inline';
type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'auto';

const CommentGenerator = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('auto');
  const [commentStyle, setCommentStyle] = useState<CommentStyle>('jsdoc');
  const [includeTypes, setIncludeTypes] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(false);
  const [includeAuthor, setIncludeAuthor] = useState(false);
  const { toast } = useToast();

  const detectLanguage = (code: string): CodeLanguage => {
    if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('var')) {
      if (code.includes('interface') || code.includes('type') || code.includes(': string') || code.includes(': number')) {
        return 'typescript';
      }
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('class ') || code.includes('if __name__')) {
      return 'python';
    }
    if (code.includes('public class') || code.includes('private') || code.includes('public static void main')) {
      return 'java';
    }
    if (code.includes('using System') || code.includes('namespace') || code.includes('public class')) {
      return 'csharp';
    }
    return 'javascript';
  };

  const extractFunctionInfo = (code: string, lang: CodeLanguage) => {
    const functions: Array<{
      name: string;
      params: string[];
      returnType?: string;
      line: number;
      originalLine: string;
    }> = [];

    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      let match;

      switch (lang) {
        case 'javascript':
        case 'typescript':
          // 函数声明
          match = trimmedLine.match(/function\s+(\w+)\s*\(([^)]*)\)/);
          if (match) {
            functions.push({
              name: match[1],
              params: match[2] ? match[2].split(',').map(p => p.trim().split(':')[0].trim()) : [],
              line: index,
              originalLine: line
            });
          }
          
          // 箭头函数
          match = trimmedLine.match(/(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/);
          if (match) {
            functions.push({
              name: match[1],
              params: match[2] ? match[2].split(',').map(p => p.trim().split(':')[0].trim()) : [],
              line: index,
              originalLine: line
            });
          }
          break;

        case 'python':
          match = trimmedLine.match(/def\s+(\w+)\s*\(([^)]*)\)/);
          if (match) {
            functions.push({
              name: match[1],
              params: match[2] ? match[2].split(',').map(p => p.trim().split(':')[0].trim()) : [],
              line: index,
              originalLine: line
            });
          }
          break;

        case 'java':
        case 'csharp':
          match = trimmedLine.match(/(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(([^)]*)\)/);
          if (match) {
            functions.push({
              name: match[1],
              params: match[2] ? match[2].split(',').map(p => p.trim().split(/\s+/).pop() || '') : [],
              line: index,
              originalLine: line
            });
          }
          break;
      }
    });

    return functions;
  };

  const generateComment = (func: any, style: CommentStyle, lang: CodeLanguage): string => {
    const { name, params } = func;
    let comment = '';

    switch (style) {
      case 'jsdoc':
        comment = '/**\n';
        comment += ` * ${name} - 函数描述\n`;
        if (params.length > 0) {
          params.forEach((param: string) => {
            if (param) {
              const type = includeTypes ? '{*}' : '';
              comment += ` * @param ${type} ${param} - 参数描述\n`;
            }
          });
        }
        if (includeTypes) {
          comment += ` * @returns {*} 返回值描述\n`;
        }
        if (includeExamples) {
          comment += ` * @example\n`;
          comment += ` * // 使用示例\n`;
          comment += ` * ${name}(${params.map(() => 'value').join(', ')})\n`;
        }
        if (includeAuthor) {
          comment += ` * @author Your Name\n`;
          comment += ` * @date ${new Date().toISOString().split('T')[0]}\n`;
        }
        comment += ' */';
        break;

      case 'python':
        comment = '"""\n';
        comment += `${name} - 函数描述\n\n`;
        if (params.length > 0) {
          comment += 'Args:\n';
          params.forEach((param: string) => {
            if (param && param !== 'self') {
              comment += `    ${param}: 参数描述\n`;
            }
          });
          comment += '\n';
        }
        comment += 'Returns:\n';
        comment += '    返回值描述\n';
        if (includeExamples) {
          comment += '\nExample:\n';
          comment += `    >>> ${name}(${params.filter(p => p !== 'self').map(() => 'value').join(', ')})\n`;
          comment += '    预期结果\n';
        }
        comment += '"""';
        break;

      case 'java':
        comment = '/**\n';
        comment += ` * ${name} - 方法描述\n`;
        if (params.length > 0) {
          params.forEach((param: string) => {
            if (param) {
              comment += ` * @param ${param} 参数描述\n`;
            }
          });
        }
        comment += ` * @return 返回值描述\n`;
        if (includeAuthor) {
          comment += ` * @author Your Name\n`;
          comment += ` * @since ${new Date().toISOString().split('T')[0]}\n`;
        }
        comment += ' */';
        break;

      case 'csharp':
        comment = '/// <summary>\n';
        comment += `/// ${name} - 方法描述\n`;
        comment += '/// </summary>\n';
        if (params.length > 0) {
          params.forEach((param: string) => {
            if (param) {
              comment += `/// <param name="${param}">参数描述</param>\n`;
            }
          });
        }
        comment += '/// <returns>返回值描述</returns>';
        break;

      case 'inline':
        comment = `// ${name} - 函数描述`;
        break;
    }

    return comment;
  };

  const generateComments = () => {
    if (!inputCode.trim()) {
      toast({
        title: "输入为空",
        description: "请输入代码",
        variant: "destructive",
      });
      return;
    }

    try {
      const actualLang = language === 'auto' ? detectLanguage(inputCode) : language;
      const functions = extractFunctionInfo(inputCode, actualLang);
      
      if (functions.length === 0) {
        toast({
          title: "未找到函数",
          description: "代码中没有检测到函数定义",
          variant: "destructive",
        });
        return;
      }

      const lines = inputCode.split('\n');
      let result = [...lines];
      let offset = 0;

      functions.forEach(func => {
        const comment = generateComment(func, commentStyle, actualLang);
        const commentLines = comment.split('\n');
        const insertIndex = func.line + offset;
        
        // 获取原始行的缩进
        const originalIndent = func.originalLine.match(/^(\s*)/)?.[1] || '';
        const indentedCommentLines = commentLines.map(line => 
          line === '' ? '' : originalIndent + line
        );
        
        result.splice(insertIndex, 0, ...indentedCommentLines);
        offset += commentLines.length;
      });

      setOutputCode(result.join('\n'));
      
      toast({
        title: "生成成功",
        description: `为 ${functions.length} 个函数生成了注释`,
      });
    } catch (error: any) {
      toast({
        title: "生成失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputCode) {
      toast({
        title: "无内容可复制",
        description: "请先生成注释",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputCode);
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
    setInputCode('');
    setOutputCode('');
  };

  const getLanguageIcon = (lang: CodeLanguage) => {
    const icons = {
      javascript: '🟨',
      typescript: '🟦',
      python: '🐍',
      java: '☕',
      csharp: '🔷',
      auto: '🔍'
    };
    return icons[lang] || '📝';
  };

  const getStyleDescription = (style: CommentStyle) => {
    const descriptions = {
      jsdoc: 'JSDoc格式 (/** */)',
      python: 'Python文档字符串 (""")',
      java: 'Javadoc格式 (/** */)',
      csharp: 'XML文档注释 (///)',
      inline: '单行注释 (//)'
    };
    return descriptions[style];
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">注释生成器</h1>
        <p className="text-muted-foreground">
          自动生成代码注释和文档，支持多种编程语言和注释风格
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            生成配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>编程语言</Label>
                <Select value={language} onValueChange={(value: CodeLanguage) => setLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">🔍 自动检测</SelectItem>
                    <SelectItem value="javascript">🟨 JavaScript</SelectItem>
                    <SelectItem value="typescript">🟦 TypeScript</SelectItem>
                    <SelectItem value="python">🐍 Python</SelectItem>
                    <SelectItem value="java">☕ Java</SelectItem>
                    <SelectItem value="csharp">🔷 C#</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>注释风格</Label>
                <Select value={commentStyle} onValueChange={(value: CommentStyle) => setCommentStyle(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jsdoc">JSDoc (/** */)</SelectItem>
                    <SelectItem value="python">Python (""")</SelectItem>
                    <SelectItem value="java">Javadoc (/** */)</SelectItem>
                    <SelectItem value="csharp">C# XML (///)</SelectItem>
                    <SelectItem value="inline">单行注释 (//)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getStyleDescription(commentStyle)}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-types"
                  checked={includeTypes}
                  onCheckedChange={setIncludeTypes}
                />
                <Label htmlFor="include-types">包含类型信息</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-examples"
                  checked={includeExamples}
                  onCheckedChange={setIncludeExamples}
                />
                <Label htmlFor="include-examples">包含使用示例</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-author"
                  checked={includeAuthor}
                  onCheckedChange={setIncludeAuthor}
                />
                <Label htmlFor="include-author">包含作者信息</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              输入代码
              <span className="text-lg">{getLanguageIcon(language)}</span>
            </CardTitle>
            <CardDescription>
              输入需要生成注释的代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="输入代码..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={generateComments} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                生成注释
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
              <MessageSquare className="h-5 w-5" />
              生成结果
              {outputCode && (
                <Badge variant="secondary" className="ml-2">
                  {outputCode.split('\n').length} 行
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              带注释的代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={outputCode}
              readOnly
              className="min-h-[400px] font-mono text-sm"
              placeholder="生成的注释代码将显示在这里..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!outputCode}
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
              <h4 className="font-semibold mb-2">支持的注释格式：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• JSDoc - JavaScript/TypeScript标准</li>
                <li>• Python Docstring - Python文档字符串</li>
                <li>• Javadoc - Java标准文档格式</li>
                <li>• XML文档注释 - C#标准格式</li>
                <li>• 单行注释 - 简洁的行内注释</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">功能特性：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 自动检测函数和方法</li>
                <li>• 提取参数和返回值信息</li>
                <li>• 保持原有代码缩进</li>
                <li>• 可选包含类型和示例</li>
                <li>• 支持多种编程语言</li>
                <li>• 批量处理多个函数</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentGenerator;