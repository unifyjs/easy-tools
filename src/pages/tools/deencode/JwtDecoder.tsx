import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JWTPayload {
  [key: string]: any;
}

interface JWTHeader {
  [key: string]: any;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  error?: string;
}

const JwtDecoder = () => {
  const [inputToken, setInputToken] = useState('');
  const [decodedResult, setDecodedResult] = useState<DecodedJWT | null>(null);
  const { toast } = useToast();

  const base64UrlDecode = (str: string): string => {
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (str.length % 4) {
      str += '=';
    }
    
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      throw new Error('Invalid base64 encoding');
    }
  };

  const decodeJWT = (token: string): DecodedJWT => {
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts separated by dots');
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const headerJson = base64UrlDecode(headerB64);
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = base64UrlDecode(payloadB64);
      const payload = JSON.parse(payloadJson);

      return {
        header,
        payload,
        signature,
        isValid: true
      };
    } catch (error) {
      return {
        header: {},
        payload: {},
        signature: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleDecode = () => {
    if (!inputToken.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要解码的JWT Token",
        variant: "destructive",
      });
      return;
    }

    const result = decodeJWT(inputToken.trim());
    setDecodedResult(result);

    if (result.isValid) {
      toast({
        title: "解码成功",
        description: "JWT Token已成功解码",
      });
    } else {
      toast({
        title: "解码失败",
        description: result.error || "JWT Token格式不正确",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制内容",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputToken('');
    setDecodedResult(null);
  };

  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const formatTimestamp = (timestamp: number): string => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return '无效时间戳';
    }
  };

  const isTokenExpired = (exp?: number): boolean => {
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  };

  const examples = [
    {
      label: '标准JWT Token',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    },
    {
      label: '包含过期时间的Token',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzE2NzIwMDB9.8m4HqVXXqRMVJKEzHfa_hJi9YQNGvQr7fQ8rN2QqL8s'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">JWT解码工具</h1>
          </div>
          <p className="text-gray-600">
            JWT Token解析和验证工具，查看Token的Header、Payload和签名信息
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>JWT Token输入</CardTitle>
            <CardDescription>输入要解码的JWT Token</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="请输入JWT Token，例如：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="min-h-[120px] resize-none font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleDecode}>
                <Key className="w-4 h-4 mr-2" />
                解码JWT
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 解码结果 */}
        {decodedResult && (
          <div className="space-y-6">
            {/* 状态指示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {decodedResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  解码状态
                </CardTitle>
              </CardHeader>
              <CardContent>
                {decodedResult.isValid ? (
                  <div className="text-green-600">
                    ✅ JWT Token解码成功
                  </div>
                ) : (
                  <div className="text-red-600">
                    ❌ JWT Token解码失败: {decodedResult.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {decodedResult.isValid && (
              <>
                {/* Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Header (头部)
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(formatJson(decodedResult.header), 'Header')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </CardTitle>
                    <CardDescription>JWT的头部信息，包含算法和类型</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {formatJson(decodedResult.header)}
                    </pre>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      {decodedResult.header.alg && (
                        <div><strong>算法:</strong> {decodedResult.header.alg}</div>
                      )}
                      {decodedResult.header.typ && (
                        <div><strong>类型:</strong> {decodedResult.header.typ}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Payload (载荷)
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(formatJson(decodedResult.payload), 'Payload')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </CardTitle>
                    <CardDescription>JWT的载荷信息，包含声明和数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {formatJson(decodedResult.payload)}
                    </pre>
                    
                    {/* 标准声明解释 */}
                    <div className="mt-4 space-y-2 text-sm">
                      <h4 className="font-semibold">标准声明解释:</h4>
                      <div className="space-y-1 text-gray-600">
                        {decodedResult.payload.iss && (
                          <div><strong>iss (Issuer):</strong> {decodedResult.payload.iss}</div>
                        )}
                        {decodedResult.payload.sub && (
                          <div><strong>sub (Subject):</strong> {decodedResult.payload.sub}</div>
                        )}
                        {decodedResult.payload.aud && (
                          <div><strong>aud (Audience):</strong> {decodedResult.payload.aud}</div>
                        )}
                        {decodedResult.payload.exp && (
                          <div className={isTokenExpired(decodedResult.payload.exp) ? 'text-red-600' : 'text-green-600'}>
                            <strong>exp (Expiration):</strong> {formatTimestamp(decodedResult.payload.exp)}
                            {isTokenExpired(decodedResult.payload.exp) && ' (已过期)'}
                          </div>
                        )}
                        {decodedResult.payload.nbf && (
                          <div><strong>nbf (Not Before):</strong> {formatTimestamp(decodedResult.payload.nbf)}</div>
                        )}
                        {decodedResult.payload.iat && (
                          <div><strong>iat (Issued At):</strong> {formatTimestamp(decodedResult.payload.iat)}</div>
                        )}
                        {decodedResult.payload.jti && (
                          <div><strong>jti (JWT ID):</strong> {decodedResult.payload.jti}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Signature */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Signature (签名)
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(decodedResult.signature, 'Signature')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </CardTitle>
                    <CardDescription>JWT的签名部分，用于验证Token的完整性</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm break-all">
                      {decodedResult.signature}
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>注意:</strong> 签名验证需要密钥，此工具仅解码不验证签名有效性
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* 示例 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>示例</CardTitle>
            <CardDescription>点击示例可快速填入输入框</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setInputToken(example.value)}
                >
                  <div className="font-medium text-sm text-gray-700 mb-1">
                    {example.label}
                  </div>
                  <div className="font-mono text-xs text-gray-600 break-all">
                    {example.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* JWT说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>JWT说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              JWT (JSON Web Token) 是一种开放标准 (RFC 7519)，用于在各方之间安全地传输信息。
              JWT由三部分组成，用点号分隔：Header.Payload.Signature
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">JWT结构：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Header:</strong> 包含算法和Token类型信息</div>
                <div><strong>Payload:</strong> 包含声明(claims)，即实际要传输的数据</div>
                <div><strong>Signature:</strong> 用于验证Token的完整性和真实性</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">标准声明字段：</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>iss:</strong> 签发者</div>
                <div><strong>sub:</strong> 主题</div>
                <div><strong>aud:</strong> 受众</div>
                <div><strong>exp:</strong> 过期时间</div>
                <div><strong>nbf:</strong> 生效时间</div>
                <div><strong>iat:</strong> 签发时间</div>
                <div><strong>jti:</strong> JWT ID</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-800">安全提醒：</h4>
              <p className="text-sm text-yellow-700">
                此工具仅解码JWT内容，不验证签名有效性。在生产环境中，
                必须验证JWT签名以确保Token的完整性和真实性。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JwtDecoder;