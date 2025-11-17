import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JsonToYaml = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const jsonToYaml = (jsonStr: string): string => {
    try {
      const obj = JSON.parse(jsonStr);
      return convertObjectToYaml(obj, 0);
    } catch (error) {
      throw new Error("无效的JSON格式");
    }
  };

  const convertObjectToYaml = (obj: any, indent: number): string => {
    const spaces = "  ".repeat(indent);
    
    if (obj === null) return "null";
    if (typeof obj === "boolean") return obj.toString();
    if (typeof obj === "number") return obj.toString();
    if (typeof obj === "string") {
      // 处理包含特殊字符的字符串
      if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.includes("'") || obj.includes('"')) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      return obj.map(item => `${spaces}- ${convertObjectToYaml(item, indent + 1).replace(/^\s+/, "")}`).join("\n");
    }
    
    if (typeof obj === "object") {
      if (Object.keys(obj).length === 0) return "{}";
      return Object.entries(obj)
        .map(([key, value]) => {
          const yamlValue = convertObjectToYaml(value, indent + 1);
          if (typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
            return `${spaces}${key}:\n${yamlValue}`;
          } else if (Array.isArray(value) && value.length > 0) {
            return `${spaces}${key}:\n${yamlValue}`;
          } else {
            return `${spaces}${key}: ${yamlValue}`;
          }
        })
        .join("\n");
    }
    
    return obj.toString();
  };

  const yamlToJson = (yamlStr: string): string => {
    try {
      const obj = parseYaml(yamlStr);
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      throw new Error("无效的YAML格式");
    }
  };

  const parseYaml = (yamlStr: string): any => {
    const lines = yamlStr.split("\n").filter(line => line.trim() && !line.trim().startsWith("#"));
    const result: any = {};
    const stack: any[] = [{ obj: result, indent: -1 }];
    
    for (const line of lines) {
      const indent = line.length - line.trimStart().length;
      const trimmed = line.trim();
      
      if (!trimmed) continue;
      
      // 处理数组项
      if (trimmed.startsWith("- ")) {
        const value = trimmed.substring(2).trim();
        const current = stack[stack.length - 1];
        
        if (!Array.isArray(current.obj)) {
          current.obj = [];
        }
        
        if (value.includes(":")) {
          const obj = {};
          current.obj.push(obj);
          const [key, val] = value.split(":").map(s => s.trim());
          obj[key] = parseValue(val);
        } else {
          current.obj.push(parseValue(value));
        }
        continue;
      }
      
      // 处理键值对
      if (trimmed.includes(":")) {
        const colonIndex = trimmed.indexOf(":");
        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();
        
        // 调整栈
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
        
        const current = stack[stack.length - 1].obj;
        
        if (value === "" || value === "null") {
          current[key] = null;
          stack.push({ obj: current[key], indent });
        } else if (value === "[]") {
          current[key] = [];
        } else if (value === "{}") {
          current[key] = {};
        } else {
          current[key] = parseValue(value);
        }
      }
    }
    
    return result;
  };

  const parseValue = (value: string): any => {
    if (value === "null" || value === "") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).replace(/\\"/g, '"');
    }
    if (!isNaN(Number(value))) return Number(value);
    return value;
  };

  const convert = () => {
    if (!input.trim()) {
      toast({
        title: "错误",
        description: `请输入${mode === "json-to-yaml" ? "JSON" : "YAML"}数据`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let result = "";
      if (mode === "json-to-yaml") {
        result = jsonToYaml(input);
      } else {
        result = yamlToJson(input);
      }
      
      setOutput(result);
      
      toast({
        title: "成功",
        description: "转换完成",
      });
    } catch (error: any) {
      toast({
        title: "错误",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    setInput(output);
    setOutput("");
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "复制失败",
        variant: "destructive",
      });
    }
  };

  const downloadFile = () => {
    if (!output) return;
    
    const extension = mode === "json-to-yaml" ? "yaml" : "json";
    const filename = `converted.${extension}`;
    
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
    setInput("");
    setOutput("");
  };

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  }
}`;

  const sampleYaml = `name: John Doe
age: 30
city: New York
hobbies:
  - reading
  - swimming
address:
  street: 123 Main St
  zipCode: "10001"`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">JSON ⇄ YAML 转换器</h1>
        <p className="text-muted-foreground">
          JSON 和 YAML 格式之间的相互转换工具
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={switchMode}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          {mode === "json-to-yaml" ? "切换到 YAML → JSON" : "切换到 JSON → YAML"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "json-to-yaml" ? "JSON 输入" : "YAML 输入"}
            </CardTitle>
            <CardDescription>
              粘贴或输入您的 {mode === "json-to-yaml" ? "JSON" : "YAML"} 数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`输入${mode === "json-to-yaml" ? "JSON" : "YAML"}数据...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(mode === "json-to-yaml" ? sampleJson : sampleYaml)}
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

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {mode === "json-to-yaml" ? "YAML 输出" : "JSON 输出"}
                </CardTitle>
                <CardDescription>
                  转换后的 {mode === "json-to-yaml" ? "YAML" : "JSON"} 格式
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
                <Button variant="outline" size="sm" onClick={downloadFile} disabled={!output}>
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              placeholder="转换结果将显示在这里..."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <Button 
              onClick={convert} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "转换中..." : `转换为 ${mode === "json-to-yaml" ? "YAML" : "JSON"}`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">JSON 格式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 使用花括号 {} 表示对象</li>
                <li>• 使用方括号 [] 表示数组</li>
                <li>• 字符串必须用双引号包围</li>
                <li>• 支持嵌套结构</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">YAML 格式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 使用缩进表示层级关系</li>
                <li>• 使用 - 表示数组项</li>
                <li>• 字符串通常不需要引号</li>
                <li>• 更易读的配置文件格式</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToYaml;