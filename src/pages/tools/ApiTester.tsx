import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Send, Plus, Trash2, Copy, Clock, CheckCircle, XCircle, Upload, FileText, Code, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type BodyType = 'none' | 'json' | 'form' | 'multipart' | 'raw' | 'binary';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface FormParam {
  key: string;
  value: string;
  type: 'text' | 'file';
  file?: File;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

const ApiTester = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '', enabled: true }]);
  const [bodyType, setBodyType] = useState<BodyType>('none');
  const [jsonBody, setJsonBody] = useState('{\n  "key": "value"\n}');
  const [rawBody, setRawBody] = useState('');
  const [formParams, setFormParams] = useState<FormParam[]>([{ key: '', value: '', type: 'text', enabled: true }]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Header 管理
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    (newHeaders[index] as any)[field] = value;
    setHeaders(newHeaders);
  };

  // Form 参数管理
  const addFormParam = () => {
    setFormParams([...formParams, { key: '', value: '', type: 'text', enabled: true }]);
  };

  const removeFormParam = (index: number) => {
    setFormParams(formParams.filter((_, i) => i !== index));
  };

  const updateFormParam = (index: number, field: keyof FormParam, value: string | boolean | File) => {
    const newParams = [...formParams];
    (newParams[index] as any)[field] = value;
    setFormParams(newParams);
  };

  const handleFileUpload = (index: number, file: File | null) => {
    if (file) {
      updateFormParam(index, 'file', file);
      updateFormParam(index, 'value', file.name);
    }
  };

  // 构建请求体
  const buildRequestBody = () => {
    switch (bodyType) {
      case 'json':
        try {
          JSON.parse(jsonBody);
          return { body: jsonBody, contentType: 'application/json' };
        } catch {
          throw new Error('JSON格式错误');
        }
      
      case 'raw':
        return { body: rawBody, contentType: 'text/plain' };
      
      case 'form':
        const formData = new URLSearchParams();
        formParams
          .filter(param => param.enabled && param.key.trim() && param.type === 'text')
          .forEach(param => {
            formData.append(param.key.trim(), param.value);
          });
        return { body: formData.toString(), contentType: 'application/x-www-form-urlencoded' };
      
      case 'multipart':
        const multipartData = new FormData();
        formParams
          .filter(param => param.enabled && param.key.trim())
          .forEach(param => {
            if (param.type === 'file' && param.file) {
              multipartData.append(param.key.trim(), param.file);
            } else if (param.type === 'text') {
              multipartData.append(param.key.trim(), param.value);
            }
          });
        return { body: multipartData, contentType: null }; // FormData会自动设置Content-Type
      
      default:
        return { body: null, contentType: null };
    }
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      toast({
        title: "URL不能为空",
        description: "请输入API接口地址",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      // 构建请求头
      const requestHeaders: Record<string, string> = {};
      headers
        .filter(header => header.enabled && header.key.trim() && header.value.trim())
        .forEach(header => {
          requestHeaders[header.key.trim()] = header.value.trim();
        });

      // 构建请求体
      let requestBody = null;
      let autoContentType = null;

      if (['POST', 'PUT', 'PATCH'].includes(method) && bodyType !== 'none') {
        const { body, contentType } = buildRequestBody();
        requestBody = body;
        autoContentType = contentType;
      }

      // 自动设置Content-Type（如果用户没有手动设置）
      if (autoContentType && !requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
        requestHeaders['Content-Type'] = autoContentType;
      }

      // 构建请求配置
      const config: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (requestBody) {
        config.body = requestBody;
      }

      const response = await fetch(url, config);
      const endTime = Date.now();
      
      // 获取响应头
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // 获取响应数据和大小
      let responseData;
      let responseSize = 0;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const text = await response.text();
        responseSize = new Blob([text]).size;
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      } else if (contentType?.includes('image/') || contentType?.includes('application/octet-stream')) {
        const blob = await response.blob();
        responseSize = blob.size;
        responseData = `Binary data (${blob.type}, ${responseSize} bytes)`;
      } else {
        const text = await response.text();
        responseSize = new Blob([text]).size;
        responseData = text;
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime,
        size: responseSize
      });

      toast({
        title: "请求成功",
        description: `状态码: ${response.status} | 耗时: ${endTime - startTime}ms | 大小: ${formatBytes(responseSize)}`,
      });

    } catch (error: any) {
      const endTime = Date.now();
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: error.message,
        time: endTime - startTime,
        size: 0
      });

      toast({
        title: "请求失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;

    try {
      const responseText = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
      
      await navigator.clipboard.writeText(responseText);
      toast({
        title: "复制成功",
        description: "响应内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'destructive';
    if (status >= 200 && status < 300) return 'default';
    if (status >= 300 && status < 400) return 'secondary';
    if (status >= 400 && status < 500) return 'destructive';
    if (status >= 500) return 'destructive';
    return 'secondary';
  };

  const getStatusIcon = (status: number) => {
    if (status === 0) return <XCircle className="h-4 w-4" />;
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const formatResponseData = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  const getBodyTypeIcon = (type: BodyType) => {
    switch (type) {
      case 'json': return <Code className="h-4 w-4" />;
      case 'form': return <Database className="h-4 w-4" />;
      case 'multipart': return <Upload className="h-4 w-4" />;
      case 'raw': return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API测试工具</h1>
        <p className="text-muted-foreground">
          强大的REST API测试工具，支持JSON、Form、文件上传等多种参数类型
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 请求配置 */}
          <Card>
            <CardHeader>
              <CardTitle>请求配置</CardTitle>
              <CardDescription>
                配置API请求的基本信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL和方法 */}
              <div className="flex gap-2">
                <Select value={method} onValueChange={(value: HttpMethod) => setMethod(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="输入API接口地址..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
              </div>

              <Button 
                onClick={sendRequest} 
                disabled={loading}
                className="w-full flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? '发送中...' : '发送请求'}
              </Button>
            </CardContent>
          </Card>

          {/* 请求头 */}
          <Card>
            <CardHeader>
              <CardTitle>请求头 (Headers)</CardTitle>
              <CardDescription>
                设置HTTP请求头信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Switch
                    checked={header.enabled}
                    onCheckedChange={(checked) => updateHeader(index, 'enabled', checked)}
                  />
                  <Input
                    placeholder="Header名称"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1"
                    disabled={!header.enabled}
                  />
                  <Input
                    placeholder="Header值"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1"
                    disabled={!header.enabled}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeHeader(index)}
                    disabled={headers.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addHeader} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                添加请求头
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* 请求体 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getBodyTypeIcon(bodyType)}
                请求体 (Body)
              </CardTitle>
              <CardDescription>
                配置请求体内容和格式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 请求体类型选择 */}
              <div>
                <Label>请求体类型</Label>
                <Select 
                  value={bodyType} 
                  onValueChange={(value: BodyType) => setBodyType(value)}
                  disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无请求体</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form">Form (URL-encoded)</SelectItem>
                    <SelectItem value="multipart">Multipart (文件上传)</SelectItem>
                    <SelectItem value="raw">Raw (纯文本)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* JSON 请求体 */}
              {bodyType === 'json' && (
                <div>
                  <Label>JSON 数据</Label>
                  <Textarea
                    placeholder="输入JSON数据..."
                    value={jsonBody}
                    onChange={(e) => setJsonBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}

              {/* Raw 请求体 */}
              {bodyType === 'raw' && (
                <div>
                  <Label>原始数据</Label>
                  <Textarea
                    placeholder="输入原始文本数据..."
                    value={rawBody}
                    onChange={(e) => setRawBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}

              {/* Form 参数 */}
              {(bodyType === 'form' || bodyType === 'multipart') && (
                <div className="space-y-2">
                  <Label>
                    {bodyType === 'form' ? 'Form 参数' : 'Multipart 参数'}
                  </Label>
                  {formParams.map((param, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-md">
                      <div className="flex gap-2 items-center">
                        <Switch
                          checked={param.enabled}
                          onCheckedChange={(checked) => updateFormParam(index, 'enabled', checked)}
                        />
                        <Input
                          placeholder="参数名"
                          value={param.key}
                          onChange={(e) => updateFormParam(index, 'key', e.target.value)}
                          className="flex-1"
                          disabled={!param.enabled}
                        />
                        {bodyType === 'multipart' && (
                          <Select
                            value={param.type}
                            onValueChange={(value: 'text' | 'file') => updateFormParam(index, 'type', value)}
                            disabled={!param.enabled}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">文本</SelectItem>
                              <SelectItem value="file">文件</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFormParam(index)}
                          disabled={formParams.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {param.type === 'file' && bodyType === 'multipart' ? (
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            onChange={(e) => handleFileUpload(index, e.target.files?.[0] || null)}
                            disabled={!param.enabled}
                            className="flex-1"
                          />
                          {param.file && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              {param.file.name}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Input
                          placeholder="参数值"
                          value={param.value}
                          onChange={(e) => updateFormParam(index, 'value', e.target.value)}
                          disabled={!param.enabled}
                        />
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFormParam} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    添加参数
                  </Button>
                </div>
              )}

              {!['POST', 'PUT', 'PATCH'].includes(method) && (
                <p className="text-sm text-muted-foreground">
                  {method} 方法不支持请求体
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 响应结果 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            响应结果
            {response && (
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(response.status)} className="flex items-center gap-1">
                  {getStatusIcon(response.status)}
                  {response.status} {response.statusText}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {response.time}ms
                </Badge>
                <Badge variant="outline">
                  {formatBytes(response.size)}
                </Badge>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            API接口的响应信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <Tabs defaultValue="body" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="body">响应体</TabsTrigger>
                <TabsTrigger value="headers">响应头</TabsTrigger>
              </TabsList>
              
              <TabsContent value="body" className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>响应内容</Label>
                  <Button variant="outline" size="sm" onClick={copyResponse}>
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={formatResponseData(response.data)}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>
              
              <TabsContent value="headers">
                <div className="space-y-2">
                  <Label>响应头信息</Label>
                  <div className="border rounded-md p-3 max-h-[400px] overflow-y-auto">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b last:border-b-0">
                        <span className="font-mono text-sm font-medium">{key}:</span>
                        <span className="font-mono text-sm text-muted-foreground break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>发送请求后，响应结果将显示在这里</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                请求体类型：
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>JSON</strong> - 发送JSON格式数据</li>
                <li>• <strong>Form</strong> - URL编码表单数据</li>
                <li>• <strong>Multipart</strong> - 支持文件上传</li>
                <li>• <strong>Raw</strong> - 纯文本数据</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                文件上传：
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 选择Multipart类型</li>
                <li>• 添加文件类型参数</li>
                <li>• 支持多文件上传</li>
                <li>• 可混合文本和文件参数</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                高级功能：
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 参数启用/禁用开关</li>
                <li>• 自动Content-Type检测</li>
                <li>• 响应时间和大小统计</li>
                <li>• 完整的响应头信息</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTester;