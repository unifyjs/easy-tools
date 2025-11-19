import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BarChart3, FileText, Code, Hash, Clock, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'css' | 'html' | 'json' | 'auto';

interface CodeStats {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  functions: number;
  classes: number;
  imports: number;
  complexity: number;
  readingTime: number; // 分钟
}

const CodeStats = () => {
  const [inputCode, setInputCode] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('auto');
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
    if (code.includes('{') && code.includes('}') && (code.includes('color:') || code.includes('margin:') || code.includes('padding:'))) {
      return 'css';
    }
    if (code.includes('<html>') || code.includes('<div>') || code.includes('<!DOCTYPE')) {
      return 'html';
    }
    if ((code.startsWith('{') && code.endsWith('}')) || (code.startsWith('[') && code.endsWith(']'))) {
      try {
        JSON.parse(code);
        return 'json';
      } catch {
        // 不是有效JSON
      }
    }
    return 'javascript'; // 默认
  };

  const analyzeCode = (code: string, lang: CodeLanguage): CodeStats => {
    const actualLang = lang === 'auto' ? detectLanguage(code) : lang;
    const lines = code.split('\n');
    
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let functions = 0;
    let classes = 0;
    let imports = 0;
    let complexity = 0;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine === '') {
        blankLines++;
      } else if (isCommentLine(trimmedLine, actualLang)) {
        commentLines++;
      } else {
        codeLines++;
        
        // 统计函数
        if (isFunctionLine(trimmedLine, actualLang)) {
          functions++;
        }
        
        // 统计类
        if (isClassLine(trimmedLine, actualLang)) {
          classes++;
        }
        
        // 统计导入
        if (isImportLine(trimmedLine, actualLang)) {
          imports++;
        }
        
        // 计算复杂度（简单的if/for/while计数）
        complexity += getLineComplexity(trimmedLine, actualLang);
      }
    });

    const characters = code.length;
    const charactersNoSpaces = code.replace(/\s/g, '').length;
    const words = code.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(codeLines / 50); // 假设每分钟读50行代码

    return {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines,
      characters,
      charactersNoSpaces,
      words,
      functions,
      classes,
      imports,
      complexity,
      readingTime
    };
  };

  const isCommentLine = (line: string, lang: CodeLanguage): boolean => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'css':
        return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
      case 'python':
        return line.startsWith('#');
      case 'html':
        return line.startsWith('<!--');
      default:
        return line.startsWith('//') || line.startsWith('#') || line.startsWith('/*');
    }
  };

  const isFunctionLine = (line: string, lang: CodeLanguage): boolean => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return /function\s+\w+|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(|var\s+\w+\s*=\s*\(|\w+\s*:\s*\(.*\)\s*=>|\w+\s*=\s*\(.*\)\s*=>/.test(line);
      case 'python':
        return /def\s+\w+/.test(line);
      case 'java':
        return /(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(/.test(line);
      default:
        return /function\s+\w+|def\s+\w+/.test(line);
    }
  };

  const isClassLine = (line: string, lang: CodeLanguage): boolean => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return /class\s+\w+/.test(line);
      case 'python':
        return /class\s+\w+/.test(line);
      case 'java':
        return /(public|private|protected)?\s*class\s+\w+/.test(line);
      default:
        return /class\s+\w+/.test(line);
    }
  };

  const isImportLine = (line: string, lang: CodeLanguage): boolean => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return /import\s+.*from|import\s*\{|require\s*\(/.test(line);
      case 'python':
        return /import\s+|from\s+.*import/.test(line);
      case 'java':
        return /import\s+/.test(line);
      default:
        return /import\s+/.test(line);
    }
  };

  const getLineComplexity = (line: string, lang: CodeLanguage): number => {
    let complexity = 0;
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try'];
    
    complexityKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = line.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  };

  const stats = useMemo(() => {
    if (!inputCode.trim()) return null;
    return analyzeCode(inputCode, language);
  }, [inputCode, language]);

  const handleCopy = async () => {
    if (!stats) {
      toast({
        title: "无统计数据",
        description: "请先输入代码",
        variant: "destructive",
      });
      return;
    }

    const statsText = `代码统计报告
=================
总行数: ${stats.totalLines}
代码行数: ${stats.codeLines}
注释行数: ${stats.commentLines}
空白行数: ${stats.blankLines}
字符数: ${stats.characters}
字符数(无空格): ${stats.charactersNoSpaces}
单词数: ${stats.words}
函数数: ${stats.functions}
类数: ${stats.classes}
导入数: ${stats.imports}
复杂度: ${stats.complexity}
预估阅读时间: ${stats.readingTime} 分钟`;

    try {
      await navigator.clipboard.writeText(statsText);
      toast({
        title: "复制成功",
        description: "统计报告已复制到剪贴板",
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
  };

  const getLanguageIcon = (lang: CodeLanguage) => {
    const icons = {
      javascript: '🟨',
      typescript: '🟦',
      python: '🐍',
      java: '☕',
      css: '🎨',
      html: '🌐',
      json: '📄',
      auto: '🔍'
    };
    return icons[lang] || '📝';
  };

  return (
    <>
      <SEOHead toolId="code-stats" />
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">代码统计工具</h1>
        <p className="text-muted-foreground">
          统计代码行数、字符数、函数数量等信息，分析代码复杂度和结构
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              输入代码
              <span className="text-lg">{getLanguageIcon(language)}</span>
            </CardTitle>
            <CardDescription>
              输入需要统计的代码，支持多种编程语言
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={language} onValueChange={(value: CodeLanguage) => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择编程语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">🔍 自动检测</SelectItem>
                <SelectItem value="javascript">🟨 JavaScript</SelectItem>
                <SelectItem value="typescript">🟦 TypeScript</SelectItem>
                <SelectItem value="python">🐍 Python</SelectItem>
                <SelectItem value="java">☕ Java</SelectItem>
                <SelectItem value="css">🎨 CSS</SelectItem>
                <SelectItem value="html">🌐 HTML</SelectItem>
                <SelectItem value="json">📄 JSON</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea
              placeholder="输入代码..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
              {stats && (
                <Button onClick={handleCopy} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  复制报告
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {stats ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    基本统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalLines}</div>
                      <div className="text-sm text-muted-foreground">总行数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.codeLines}</div>
                      <div className="text-sm text-muted-foreground">代码行数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.commentLines}</div>
                      <div className="text-sm text-muted-foreground">注释行数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{stats.blankLines}</div>
                      <div className="text-sm text-muted-foreground">空白行数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    字符统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>总字符数</span>
                      <Badge variant="outline">{stats.characters}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>字符数(无空格)</span>
                      <Badge variant="outline">{stats.charactersNoSpaces}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>单词数</span>
                      <Badge variant="outline">{stats.words}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>代码密度</span>
                        <span>{((stats.charactersNoSpaces / stats.characters) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(stats.charactersNoSpaces / stats.characters) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    结构统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.functions}</div>
                      <div className="text-sm text-muted-foreground">函数数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{stats.classes}</div>
                      <div className="text-sm text-muted-foreground">类数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{stats.imports}</div>
                      <div className="text-sm text-muted-foreground">导入数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.complexity}</div>
                      <div className="text-sm text-muted-foreground">复杂度</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    阅读时间
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{stats.readingTime}</div>
                    <div className="text-sm text-muted-foreground">分钟</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      基于平均每分钟阅读50行代码计算
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">输入代码后，统计信息将显示在这里</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">统计项目：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 代码行数、注释行数、空白行数</li>
                <li>• 字符数统计（含/不含空格）</li>
                <li>• 函数、类、导入语句数量</li>
                <li>• 代码复杂度分析</li>
                <li>• 预估阅读时间</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">支持语言：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• JavaScript / TypeScript</li>
                <li>• Python</li>
                <li>• Java</li>
                <li>• CSS / HTML</li>
                <li>• JSON</li>
                <li>• 自动语言检测</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default CodeStats;