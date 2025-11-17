import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Send, Plus, Trash2, Copy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface Header {
  key: string;
  value: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

const ApiTester = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
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
      headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          requestHeaders[header.key.trim()] = header.value.trim();
        }
      });

      // 构建请求配置
      const config: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // 如果有请求体且方法支持
      if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.body = body;
        // 如果没有设置Content-Type，尝试自动检测
        if (!requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
          try {
            JSON.parse(body);
            requestHeaders['Content-Type'] = 'application/json';
          } catch {
            requestHeaders['Content-Type'] = 'text/plain';
          }
        }
      }

      const response = await fetch(url, config);
      const endTime = Date.now();
      
      // 获取响应头
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // 获取响应数据
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime
      });

      toast({
        title: "请求成功",
        description: `状态码: ${response.status} | 耗时: ${endTime - startTime}ms`,
      });

    } catch (error: any) {
      const endTime = Date.now();
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: error.message,
        time: endTime - startTime
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API测试工具</h1>
        <p className="text-muted-foreground">
          测试REST API接口，支持多种HTTP方法和参数配置
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>请求配置</CardTitle>
            <CardDescription>
              配置API请求的URL、方法、头部和请求体
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

            <Tabs defaultValue="headers" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="headers">请求头</TabsTrigger>
                <TabsTrigger value="body">请求体</TabsTrigger>
              </TabsList>
              
              <TabsContent value="headers" className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Header名称"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Header值"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      className="flex-1"
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
              </TabsContent>
              
              <TabsContent value="body">
                <Textarea
                  placeholder="输入请求体内容（JSON、XML、文本等）..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                />
                {!['POST', 'PUT', 'PATCH'].includes(method) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {method} 方法不支持请求体
                  </p>
                )}
              </TabsContent>
            </Tabs>

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

        <Card>
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
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
                
                <TabsContent value="headers">
                  <div className="space-y-2">
                    <Label>响应头信息</Label>
                    <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b last:border-b-0">
                          <span className="font-mono text-sm font-medium">{key}:</span>
                          <span className="font-mono text-sm text-muted-foreground">{value}</span>
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
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">支持的HTTP方法：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• GET - 获取资源</li>
                <li>• POST - 创建资源</li>
                <li>• PUT - 更新资源</li>
                <li>• DELETE - 删除资源</li>
                <li>• PATCH - 部分更新</li>
                <li>• HEAD - 获取头信息</li>
                <li>• OPTIONS - 获取支持的方法</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">功能特性：</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 自定义请求头</li>
                <li>• JSON/XML/文本请求体</li>
                <li>• 响应时间统计</li>
                <li>• 状态码显示</li>
                <li>• 响应头查看</li>
                <li>• 一键复制响应</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTester;