import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JsonToCsv = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("json-to-csv");
  const [delimiter, setDelimiter] = useState(",");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const csvToJson = (csvStr: string, delimiter: string): string => {
    const lines = csvStr.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV数据至少需要包含标题行和一行数据");
    }

    const headers = parseCSVLine(lines[0], delimiter);
    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter);
      const obj: any = {};
      
      headers.forEach((header, index) => {
        let value: any = values[index] || "";
        
        // 尝试转换数据类型
        if (value === "") {
          value = null;
        } else if (value.toLowerCase() === "true") {
          value = true;
        } else if (value.toLowerCase() === "false") {
          value = false;
        } else if (!isNaN(Number(value)) && value !== "") {
          value = Number(value);
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  };

  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // 跳过下一个引号
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const jsonToCsv = (jsonStr: string, delimiter: string): string => {
    const data = JSON.parse(jsonStr);
    
    if (!Array.isArray(data)) {
      throw new Error("JSON数据必须是对象数组格式");
    }
    
    if (data.length === 0) {
      return "";
    }

    // 获取所有可能的键
    const allKeys = new Set<string>();
    data.forEach(obj => {
      if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach(key => allKeys.add(key));
      }
    });

    const headers = Array.from(allKeys);
    const csvLines: string[] = [];

    // 添加标题行
    csvLines.push(headers.map(header => escapeCSVField(header, delimiter)).join(delimiter));

    // 添加数据行
    data.forEach(obj => {
      const row = headers.map(header => {
        const value = obj && typeof obj === "object" ? obj[header] : "";
        return escapeCSVField(String(value ?? ""), delimiter);
      });
      csvLines.push(row.join(delimiter));
    });

    return csvLines.join("\n");
  };

  const escapeCSVField = (field: string, delimiter: string): string => {
    if (field.includes(delimiter) || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const convert = () => {
    if (!input.trim()) {
      toast({
        title: "错误",
        description: `请输入${mode === "csv-to-json" ? "CSV" : "JSON"}数据`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let result = "";
      if (mode === "csv-to-json") {
        result = csvToJson(input, delimiter);
      } else {
        result = jsonToCsv(input, delimiter);
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
    setMode(mode === "csv-to-json" ? "json-to-csv" : "csv-to-json");
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
    
    const extension = mode === "csv-to-json" ? "json" : "csv";
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

  const sampleCsv = `name,age,city,active
John Doe,30,New York,true
Jane Smith,25,Los Angeles,false
Bob Johnson,35,Chicago,true`;

  const sampleJson = `[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "active": true
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "Los Angeles",
    "active": false
  },
  {
    "name": "Bob Johnson",
    "age": 35,
    "city": "Chicago",
    "active": true
  }
]`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">JSON ⇄ CSV 转换器</h1>
        <p className="text-muted-foreground">
          JSON 和 CSV 格式之间的相互转换工具
        </p>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          onClick={switchMode}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          {mode === "csv-to-json" ? "切换到 JSON → CSV" : "切换到 CSV → JSON"}
        </Button>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">分隔符:</label>
          <Select value={delimiter} onValueChange={setDelimiter}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">,（逗号）</SelectItem>
              <SelectItem value=";">；（分号）</SelectItem>
              <SelectItem value="\t">Tab</SelectItem>
              <SelectItem value="|">|（管道符）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "csv-to-json" ? "CSV 输入" : "JSON 输入"}
            </CardTitle>
            <CardDescription>
              粘贴或输入您的 {mode === "csv-to-json" ? "CSV" : "JSON"} 数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`输入${mode === "csv-to-json" ? "CSV" : "JSON"}数据...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(mode === "csv-to-json" ? sampleCsv : sampleJson)}
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
                  {mode === "csv-to-json" ? "JSON 输出" : "CSV 输出"}
                </CardTitle>
                <CardDescription>
                  转换后的 {mode === "csv-to-json" ? "JSON" : "CSV"} 格式
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
              {isLoading ? "转换中..." : `转换为 ${mode === "csv-to-json" ? "JSON" : "CSV"}`}
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
              <h4 className="font-semibold mb-2">CSV 格式要求</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 第一行必须是标题行（列名）</li>
                <li>• 使用指定的分隔符分隔字段</li>
                <li>• 包含分隔符的字段需用双引号包围</li>
                <li>• 支持数字、布尔值自动类型转换</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">JSON 格式要求</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 必须是对象数组格式</li>
                <li>• 每个对象代表一行数据</li>
                <li>• 对象的键将作为CSV的列名</li>
                <li>• 支持嵌套对象（会被转换为字符串）</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToCsv;