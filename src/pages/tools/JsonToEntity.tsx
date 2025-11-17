import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonProperty {
  name: string;
  type: string;
  isArray: boolean;
  isOptional: boolean;
}

const JsonToEntity = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [className, setClassName] = useState("MyClass");
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectType = (value: any): string => {
    if (value === null) return "Object";
    if (Array.isArray(value)) {
      if (value.length === 0) return "Object[]";
      return detectType(value[0]) + "[]";
    }
    
    switch (typeof value) {
      case "string":
        return "String";
      case "number":
        return Number.isInteger(value) ? "Integer" : "Double";
      case "boolean":
        return "Boolean";
      case "object":
        return "Object";
      default:
        return "Object";
    }
  };

  const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  const toPascalCase = (str: string): string => {
    const camelCase = toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  };

  const analyzeJson = (obj: any): JsonProperty[] => {
    const properties: JsonProperty[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const type = detectType(value);
      properties.push({
        name: key,
        type: type.replace("[]", ""),
        isArray: type.includes("[]"),
        isOptional: value === null || value === undefined
      });
    }
    
    return properties;
  };

  const generateJavaClass = (properties: JsonProperty[], className: string): string => {
    const imports = new Set<string>();
    
    if (properties.some(p => p.isArray)) {
      imports.add("import java.util.List;");
    }
    
    let code = "";
    if (imports.size > 0) {
      code += Array.from(imports).join("\n") + "\n\n";
    }
    
    code += `public class ${className} {\n`;
    
    // Fields
    properties.forEach(prop => {
      const javaType = getJavaType(prop.type);
      const fieldType = prop.isArray ? `List<${javaType}>` : javaType;
      code += `    private ${fieldType} ${toCamelCase(prop.name)};\n`;
    });
    
    code += "\n";
    
    // Constructor
    code += `    public ${className}() {}\n\n`;
    
    // Getters and Setters
    properties.forEach(prop => {
      const javaType = getJavaType(prop.type);
      const fieldType = prop.isArray ? `List<${javaType}>` : javaType;
      const fieldName = toCamelCase(prop.name);
      const methodName = toPascalCase(prop.name);
      
      code += `    public ${fieldType} get${methodName}() {\n`;
      code += `        return ${fieldName};\n`;
      code += `    }\n\n`;
      
      code += `    public void set${methodName}(${fieldType} ${fieldName}) {\n`;
      code += `        this.${fieldName} = ${fieldName};\n`;
      code += `    }\n\n`;
    });
    
    code += "}";
    return code;
  };

  const generateCSharpClass = (properties: JsonProperty[], className: string): string => {
    const imports = new Set<string>();
    
    if (properties.some(p => p.isArray)) {
      imports.add("using System.Collections.Generic;");
    }
    
    let code = "";
    if (imports.size > 0) {
      code += Array.from(imports).join("\n") + "\n\n";
    }
    
    code += `public class ${className}\n{\n`;
    
    properties.forEach(prop => {
      const csharpType = getCSharpType(prop.type);
      const fieldType = prop.isArray ? `List<${csharpType}>` : csharpType;
      const optional = prop.isOptional ? "?" : "";
      code += `    public ${fieldType}${optional} ${toPascalCase(prop.name)} { get; set; }\n`;
    });
    
    code += "}";
    return code;
  };

  const generateTypeScriptInterface = (properties: JsonProperty[], className: string): string => {
    let code = `interface ${className} {\n`;
    
    properties.forEach(prop => {
      const tsType = getTypeScriptType(prop.type);
      const fieldType = prop.isArray ? `${tsType}[]` : tsType;
      const optional = prop.isOptional ? "?" : "";
      code += `  ${toCamelCase(prop.name)}${optional}: ${fieldType};\n`;
    });
    
    code += "}";
    return code;
  };

  const generatePythonClass = (properties: JsonProperty[], className: string): string => {
    let code = "from typing import List, Optional\n\n";
    code += `class ${className}:\n`;
    code += `    def __init__(self`;
    
    // Constructor parameters
    properties.forEach(prop => {
      const pythonType = getPythonType(prop.type);
      const fieldType = prop.isArray ? `List[${pythonType}]` : pythonType;
      const optional = prop.isOptional ? `Optional[${fieldType}] = None` : fieldType;
      code += `, ${toSnakeCase(prop.name)}: ${optional}`;
    });
    
    code += "):\n";
    
    // Constructor body
    properties.forEach(prop => {
      const fieldName = toSnakeCase(prop.name);
      code += `        self.${fieldName} = ${fieldName}\n`;
    });
    
    return code;
  };

  const generateGoStruct = (properties: JsonProperty[], className: string): string => {
    let code = `type ${className} struct {\n`;
    
    properties.forEach(prop => {
      const goType = getGoType(prop.type);
      const fieldType = prop.isArray ? `[]${goType}` : goType;
      const pointer = prop.isOptional ? "*" : "";
      code += `    ${toPascalCase(prop.name)} ${pointer}${fieldType} \`json:"${prop.name}"\`\n`;
    });
    
    code += "}";
    return code;
  };

  const getJavaType = (type: string): string => {
    switch (type) {
      case "String": return "String";
      case "Integer": return "Integer";
      case "Double": return "Double";
      case "Boolean": return "Boolean";
      case "Object": return "Object";
      default: return "Object";
    }
  };

  const getCSharpType = (type: string): string => {
    switch (type) {
      case "String": return "string";
      case "Integer": return "int";
      case "Double": return "double";
      case "Boolean": return "bool";
      case "Object": return "object";
      default: return "object";
    }
  };

  const getTypeScriptType = (type: string): string => {
    switch (type) {
      case "String": return "string";
      case "Integer": return "number";
      case "Double": return "number";
      case "Boolean": return "boolean";
      case "Object": return "any";
      default: return "any";
    }
  };

  const getPythonType = (type: string): string => {
    switch (type) {
      case "String": return "str";
      case "Integer": return "int";
      case "Double": return "float";
      case "Boolean": return "bool";
      case "Object": return "dict";
      default: return "Any";
    }
  };

  const getGoType = (type: string): string => {
    switch (type) {
      case "String": return "string";
      case "Integer": return "int";
      case "Double": return "float64";
      case "Boolean": return "bool";
      case "Object": return "interface{}";
      default: return "interface{}";
    }
  };

  const generateCode = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "错误",
        description: "请输入JSON数据",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const jsonObj = JSON.parse(jsonInput);
      const properties = analyzeJson(jsonObj);
      
      let generatedCode = "";
      
      switch (language) {
        case "java":
          generatedCode = generateJavaClass(properties, className);
          break;
        case "csharp":
          generatedCode = generateCSharpClass(properties, className);
          break;
        case "typescript":
          generatedCode = generateTypeScriptInterface(properties, className);
          break;
        case "python":
          generatedCode = generatePythonClass(properties, className);
          break;
        case "go":
          generatedCode = generateGoStruct(properties, className);
          break;
        default:
          generatedCode = "不支持的语言";
      }
      
      setOutput(generatedCode);
      
      toast({
        title: "成功",
        description: "代码生成完成",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "JSON格式不正确，请检查输入",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "成功",
        description: "代码已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "复制失败",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    if (!output) return;
    
    const extensions: { [key: string]: string } = {
      java: "java",
      csharp: "cs",
      typescript: "ts",
      python: "py",
      go: "go"
    };
    
    const extension = extensions[language] || "txt";
    const filename = `${className}.${extension}`;
    
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "成功",
      description: `文件 ${filename} 已下载`,
    });
  };

  const clearAll = () => {
    setJsonInput("");
    setOutput("");
    setClassName("MyClass");
  };

  const sampleJson = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "scores": [95, 87, 92],
  "metadata": null
}`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">JSON转实体类</h1>
        <p className="text-muted-foreground">
          将JSON数据转换为多种编程语言的实体类代码，支持Java、C#、TypeScript、Python、Go等
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>JSON输入</CardTitle>
            <CardDescription>
              粘贴或输入您的JSON数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON数据</Label>
              <Textarea
                id="json-input"
                placeholder="输入JSON数据..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJsonInput(sampleJson)}
              >
                使用示例
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 配置和输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle>生成配置</CardTitle>
            <CardDescription>
              选择目标语言和类名
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">目标语言</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class-name">类名</Label>
                <Input
                  id="class-name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="输入类名"
                />
              </div>
            </div>
            
            <Button 
              onClick={generateCode} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "生成中..." : "生成代码"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 输出区域 */}
      {output && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>生成的代码</CardTitle>
                <CardDescription>
                  {language.charAt(0).toUpperCase() + language.slice(1)} 实体类代码
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCode}>
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">支持的语言</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Java - 生成标准的POJO类</li>
                <li>• C# - 生成带属性的类</li>
                <li>• TypeScript - 生成接口定义</li>
                <li>• Python - 生成数据类</li>
                <li>• Go - 生成结构体</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">功能特性</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 自动类型推断</li>
                <li>• 数组类型支持</li>
                <li>• 可选字段处理</li>
                <li>• 命名规范转换</li>
                <li>• 代码格式化</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToEntity;