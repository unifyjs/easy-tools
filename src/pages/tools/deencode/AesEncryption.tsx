import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";

const AesEncryption = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [mode, setMode] = useState("CBC");
  const [padding, setPadding] = useState("Pkcs7");
  const [keyFormat, setKeyFormat] = useState("utf8");
  const [ivFormat, setIvFormat] = useState("utf8");
  const [outputFormat, setOutputFormat] = useState("base64");
  const { toast } = useToast();

  const modes = [
    { value: "CBC", label: "CBC (Cipher Block Chaining)" },
    { value: "CFB", label: "CFB (Cipher Feedback)" },
    { value: "CTR", label: "CTR (Counter)" },
    { value: "OFB", label: "OFB (Output Feedback)" },
    { value: "ECB", label: "ECB (Electronic Codebook)" }
  ];

  const paddings = [
    { value: "Pkcs7", label: "PKCS#7" },
    { value: "Iso97971", label: "ISO/IEC 9797-1" },
    { value: "AnsiX923", label: "ANSI X9.23" },
    { value: "Iso10126", label: "ISO 10126" },
    { value: "ZeroPadding", label: "Zero Padding" },
    { value: "NoPadding", label: "No Padding" }
  ];

  const formats = [
    { value: "utf8", label: "UTF-8" },
    { value: "hex", label: "Hex" },
    { value: "base64", label: "Base64" }
  ];

  const parseKey = (keyStr: string, format: string) => {
    switch (format) {
      case "hex":
        return CryptoJS.enc.Hex.parse(keyStr);
      case "base64":
        return CryptoJS.enc.Base64.parse(keyStr);
      default:
        return CryptoJS.enc.Utf8.parse(keyStr);
    }
  };

  const parseIv = (ivStr: string, format: string) => {
    if (!ivStr) return undefined;
    switch (format) {
      case "hex":
        return CryptoJS.enc.Hex.parse(ivStr);
      case "base64":
        return CryptoJS.enc.Base64.parse(ivStr);
      default:
        return CryptoJS.enc.Utf8.parse(ivStr);
    }
  };

  const formatOutput = (encrypted: CryptoJS.lib.CipherParams, format: string) => {
    switch (format) {
      case "hex":
        return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
      case "base64":
        return encrypted.toString();
      default:
        return encrypted.toString();
    }
  };

  const encrypt = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "错误",
          description: "请输入要加密的文本",
          variant: "destructive",
        });
        return;
      }

      if (!key.trim()) {
        toast({
          title: "错误",
          description: "请输入密钥",
          variant: "destructive",
        });
        return;
      }

      const parsedKey = parseKey(key, keyFormat);
      const parsedIv = parseIv(iv, ivFormat);

      let encrypted;
      const options: any = {
        mode: (CryptoJS.mode as any)[mode],
        padding: (CryptoJS.pad as any)[padding]
      };

      if (mode !== "ECB" && parsedIv) {
        options.iv = parsedIv;
      }

      encrypted = CryptoJS.AES.encrypt(input, parsedKey, options);
      
      const result = formatOutput(encrypted, outputFormat);
      setOutput(result);

      toast({
        title: "加密成功",
        description: "文本已成功加密",
      });
    } catch (error) {
      toast({
        title: "加密失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const decrypt = () => {
    try {
      if (!input.trim()) {
        toast({
          title: "错误",
          description: "请输入要解密的文本",
          variant: "destructive",
        });
        return;
      }

      if (!key.trim()) {
        toast({
          title: "错误",
          description: "请输入密钥",
          variant: "destructive",
        });
        return;
      }

      const parsedKey = parseKey(key, keyFormat);
      const parsedIv = parseIv(iv, ivFormat);

      const options: any = {
        mode: (CryptoJS.mode as any)[mode],
        padding: (CryptoJS.pad as any)[padding]
      };

      if (mode !== "ECB" && parsedIv) {
        options.iv = parsedIv;
      }

      const decrypted = CryptoJS.AES.decrypt(input, parsedKey, options);
      const result = decrypted.toString(CryptoJS.enc.Utf8);

      if (!result) {
        throw new Error("解密失败，请检查密钥、IV或输入格式");
      }

      setOutput(result);

      toast({
        title: "解密成功",
        description: "文本已成功解密",
      });
    } catch (error) {
      toast({
        title: "解密失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const generateRandomKey = () => {
    const randomKey = CryptoJS.lib.WordArray.random(32); // 256-bit key
    setKey(randomKey.toString(CryptoJS.enc.Hex));
    setKeyFormat("hex");
  };

  const generateRandomIv = () => {
    const randomIv = CryptoJS.lib.WordArray.random(16); // 128-bit IV
    setIv(randomIv.toString(CryptoJS.enc.Hex));
    setIvFormat("hex");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    });
  };

  const downloadResult = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aes_result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <SEOHead toolId="aes-encryption" />
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AES加密解密</h1>
        <p className="text-muted-foreground">
          高级加密标准(AES)加密解密工具，支持多种加密模式和填充方式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 配置面板 */}
        <Card>
          <CardHeader>
            <CardTitle>加密配置</CardTitle>
            <CardDescription>设置加密参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mode">加密模式</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="padding">填充方式</Label>
                <Select value={padding} onValueChange={setPadding}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paddings.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="key">密钥 (Key)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomKey}
                >
                  生成随机密钥
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="输入密钥"
                  className="flex-1"
                />
                <Select value={keyFormat} onValueChange={setKeyFormat}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mode !== "ECB" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="iv">初始向量 (IV)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomIv}
                  >
                    生成随机IV
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="iv"
                    value={iv}
                    onChange={(e) => setIv(e.target.value)}
                    placeholder="输入初始向量"
                    className="flex-1"
                  />
                  <Select value={ivFormat} onValueChange={setIvFormat}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="outputFormat">输出格式</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 操作面板 */}
        <Card>
          <CardHeader>
            <CardTitle>操作</CardTitle>
            <CardDescription>执行加密或解密操作</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="encrypt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encrypt">加密</TabsTrigger>
                <TabsTrigger value="decrypt">解密</TabsTrigger>
              </TabsList>
              
              <TabsContent value="encrypt" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="input">输入明文</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        上传文件
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入要加密的文本"
                    rows={6}
                  />
                </div>
                <Button onClick={encrypt} className="w-full">
                  加密
                </Button>
              </TabsContent>
              
              <TabsContent value="decrypt" className="space-y-4">
                <div>
                  <Label htmlFor="input">输入密文</Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入要解密的文本"
                    rows={6}
                  />
                </div>
                <Button onClick={decrypt} className="w-full">
                  解密
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 结果面板 */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>结果</CardTitle>
              <CardDescription>加密或解密的结果</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(output)}
                disabled={!output}
              >
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResult}
                disabled={!output}
              >
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
            placeholder="结果将在这里显示"
            rows={8}
            className="font-mono"
          />
        </CardContent>
      </Card>

      {/* 说明文档 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">加密模式说明：</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>CBC (Cipher Block Chaining)</strong>: 最常用的模式，需要IV，安全性高</li>
              <li><strong>CFB (Cipher Feedback)</strong>: 流密码模式，需要IV，适合实时加密</li>
              <li><strong>CTR (Counter)</strong>: 计数器模式，需要IV，支持并行处理</li>
              <li><strong>OFB (Output Feedback)</strong>: 输出反馈模式，需要IV，错误不会传播</li>
              <li><strong>ECB (Electronic Codebook)</strong>: 最简单的模式，不需要IV，但安全性较低</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">填充方式说明：</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>PKCS#7</strong>: 最常用的填充方式，兼容性好</li>
              <li><strong>ISO/IEC 9797-1</strong>: ISO标准填充方式</li>
              <li><strong>ANSI X9.23</strong>: ANSI标准填充方式</li>
              <li><strong>ISO 10126</strong>: 使用随机数据填充</li>
              <li><strong>Zero Padding</strong>: 使用零字节填充</li>
              <li><strong>No Padding</strong>: 不使用填充，数据长度必须是16字节的倍数</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">注意事项：</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>密钥长度应为16、24或32字节（对应AES-128、AES-192、AES-256）</li>
              <li>IV长度必须为16字节</li>
              <li>ECB模式不需要IV，但安全性较低，不推荐用于生产环境</li>
              <li>请妥善保管密钥和IV，丢失将无法解密数据</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AesEncryption;