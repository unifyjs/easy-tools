import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ArrowRight, Code, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ConversionType = 'ts-to-js' | 'js-to-ts' | 'json-to-interface' | 'css-to-js' | 'html-to-jsx';

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [conversionType, setConversionType] = useState<ConversionType>('ts-to-js');
  const { toast } = useToast();

  const convertTsToJs = (code: string): string => {
    return code
      .replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*[=,;)])/g, '') // 移除类型注解
      .replace(/interface\s+\w+\s*{[^}]*}/g, '') // 移除接口定义
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '') // 移除类型别名
      .replace(/export\s+interface\s+\w+\s*{[^}]*}/g, '') // 移除导出接口
      .replace(/export\s+type\s+\w+\s*=\s*[^;]+;/g, '') // 移除导出类型
      .replace(/import\s+type\s+{[^}]*}\s+from\s+['"][^'"]*['"];?/g, '') // 移除类型导入
      .replace(/as\s+\w+/g, '') // 移除类型断言
      .replace(/<\w+>/g, '') // 移除泛型
      .replace(/public\s+|private\s+|protected\s+|readonly\s+/g, '') // 移除访问修饰符
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 清理多余空行
      .trim();
  };

  const convertJsToTs = (code: string): string => {
    // 基本的JS到TS转换（添加基本类型注解）
    return code
      .replace(/function\s+(\w+)\s*\(/g, 'function $1(') // 保持函数声明
      .replace(/const\s+(\w+)\s*=\s*(\d+)/g, 'const $1: number = $2') // 数字类型
      .replace(/const\s+(\w+)\s*=\s*['"`][^'"`]*['"`]/g, 'const $1: string = $&'.replace('const $1: string = const ', 'const ').replace(' = const ', ' = ')) // 字符串类型
      .replace(/const\s+(\w+)\s*=\s*(true|false)/g, 'const $1: boolean = $2') // 布尔类型
      .replace(/let\s+(\w+)\s*=\s*(\d+)/g, 'let $1: number = $2') // let数字类型
      .replace(/let\s+(\w+)\s*=\s*['"`][^'"`]*['"`]/g, 'let $1: string = $&'.replace('let $1: string = let ', 'let ').replace(' = let ', ' = ')) // let字符串类型
      .replace(/let\s+(\w+)\s*=\s*(true|false)/g, 'let $1: boolean = $2'); // let布尔类型
  };

  const convertJsonToInterface = (code: string): string => {
    try {
      const obj = JSON.parse(code);
      
      const generateInterface = (obj: any, name: string = 'Root'): string => {
        let result = `interface ${name} {\n`;
        
        for (const [key, value] of Object.entries(obj)) {
          const type = getTypeFromValue(value);
          result += `  ${key}: ${type};\n`;
        }
        
        result += '}\n';
        return result;
      };
      
      const getTypeFromValue = (value: any): string => {
        if (value === null) return 'null';
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';
          const firstType = getTypeFromValue(value[0]);
          return `${firstType}[]`;
        }
        if (typeof value === 'object') return 'object';
        return typeof value;
      };
      
      return generateInterface(obj);
    } catch (error) {
      throw new Error('无效的JSON格式');
    }
  };

  const convertCssToJs = (code: string): string => {
    const cssRules = code.split('}').filter(rule => rule.trim());
    let jsObject = '{\n';
    
    cssRules.forEach(rule => {
      const [selector, properties] = rule.split('{');
      if (!selector || !properties) return;
      
      const cleanSelector = selector.trim().replace(/[^a-zA-Z0-9]/g, '');
      const jsProperties = properties
        .split(';')
        .filter(prop => prop.trim())
        .map(prop => {
          const [key, value] = prop.split(':');
          if (!key || !value) return '';
          const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          return `    ${camelKey}: '${value.trim()}'`;
        })
        .filter(prop => prop)
        .join(',\n');
      
      if (jsProperties) {
        jsObject += `  ${cleanSelector}: {\n${jsProperties}\n  },\n`;
      }
    });
    
    jsObject += '}';
    return jsObject;
  };

  const convertHtmlToJsx = (code: string): string => {
    return code
      .replace(/class=/g, 'className=') // class -> className
      .replace(/for=/g, 'htmlFor=') // for -> htmlFor
      .replace(/<!--[\s\S]*?-->/g, '{/* $& */}') // HTML注释 -> JSX注释
      .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2 />') // 自闭合标签
      .replace(/style="([^"]*)"/g, (match, styles) => {
        // 转换内联样式
        const styleObj = styles
          .split(';')
          .filter((s: string) => s.trim())
          .map((s: string) => {
            const [key, value] = s.split(':');
            if (!key || !value) return '';
            const camelKey = key.trim().replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
            return `${camelKey}: '${value.trim()}'`;
          })
          .filter((s: string) => s)
          .join(', ');
        return `style={{${styleObj}}}`;
      });
  };

  const convertCode = (code: string, type: ConversionType): string => {
    switch (type) {
      case 'ts-to-js':
        return convertTsToJs(code);
      case 'js-to-ts':
        return convertJsToTs(code);
      case 'json-to-interface':
        return convertJsonToInterface(code);
      case 'css-to-js':
        return convertCssToJs(code);
      case 'html-to-jsx':
        return convertHtmlToJsx(code);
      default:
        return code;
    }
  };

  const handleConvert = () => {
    if (!inputCode.trim()) {
      toast({
        title: "输入为空",
        description: "请输入需要转换的代码",
        variant: "destructive",
      });
      return;
    }

    try {
      const converted = convertCode(inputCode, conversionType);
      setOutputCode(converted);
      toast({
        title: "转换成功",
        description: "代码已成功转换",
      });
    } catch (error: any) {
      toast({
        title: "转换失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputCode) {
      toast({
        title: "无内容可复制",
        description: "请先转换代码",
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

  const getConversionInfo = (type: ConversionType) => {
    const info = {
      'ts-to-js': { from: 'TypeScript', to: 'JavaScript', icon: '🟦→🟨' },
      'js-to-ts': { from: 'JavaScript', to: 'TypeScript', icon: '🟨→🟦' },
      'json-to-interface': { from: 'JSON', to: 'TypeScript Interface', icon: '📄→🔷' },
      'css-to-js': { from: 'CSS', to: 'JavaScript Object', icon: '🎨→🟨' },
      'html-to-jsx': { from: 'HTML', to: 'JSX', icon: '🌐→⚛️' },
    };
    return info[type];
  };

  const conversionInfo = getConversionInfo(conversionType);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">代码转换器</h1>
        <p className="text-muted-foreground">
          代码语言转换工具，支持TypeScript转JavaScript、JSON转接口等多种转换
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            转换类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={conversionType} onValueChange={(value: ConversionType) => setConversionType(value)}>
              <SelectTrigger className="w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ts-to-js">🟦→🟨 TypeScript → JavaScript</SelectItem>
                <SelectItem value="js-to-ts">🟨→🟦 JavaScript → TypeScript</SelectItem>
                <SelectItem value="json-to-interface">📄→🔷 JSON → TypeScript Interface</SelectItem>
                <SelectItem value="css-to-js">🎨→🟨 CSS → JavaScript Object</SelectItem>
                <SelectItem value="html-to-jsx">🌐→⚛️ HTML → JSX</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{conversionInfo.from}</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="outline">{conversionInfo.to}</Badge>
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
              <Badge variant="secondary">{conversionInfo.from}</Badge>
            </CardTitle>
            <CardDescription>
              输入需要转换的{conversionInfo.from}代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`输入${conversionInfo.from}代码...`}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleConvert} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                转换代码
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
              转换结果
              <Badge variant="secondary">{conversionInfo.to}</Badge>
              {outputCode && (
                <Badge variant="outline" className="ml-2">
                  {outputCode.split('\n').length} 行
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              转换后的{conversionInfo.to}代码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={outputCode}
              readOnly
              className="min-h-[400px] font-mono text-sm"
              placeholder="转换结果将显示在这里..."
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
          <CardTitle>转换说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">支持的转换类型：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• TypeScript → JavaScript（移除类型注解）</li>
                <li>• JavaScript → TypeScript（添加基本类型）</li>
                <li>• JSON → TypeScript接口定义</li>
                <li>• CSS → JavaScript样式对象</li>
                <li>• HTML → JSX（React组件格式）</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">注意事项：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 转换结果可能需要手动调整</li>
                <li>• 复杂类型转换可能不完整</li>
                <li>• 建议转换后进行代码检查</li>
                <li>• 某些语法特性可能不支持</li>
                <li>• 转换前请备份原始代码</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeConverter;