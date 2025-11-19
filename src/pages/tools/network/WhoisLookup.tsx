import React, { useState, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Search, Globe, Calendar, User, Building, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhoisInfo {
  domain: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  updatedDate: string;
  status: string[];
  nameServers: string[];
  registrant: {
    name?: string;
    organization?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  admin: {
    name?: string;
    organization?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  tech: {
    name?: string;
    organization?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  dnssec: boolean;
  rawData: string;
}

const WhoisLookup = () => {
  const [domain, setDomain] = useState('');
  const [whoisInfo, setWhoisInfo] = useState<WhoisInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const { toast } = useToast();

  // 验证域名格式
  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return domainRegex.test(domain) && domain.includes('.');
  };

  // 模拟Whois查询
  const simulateWhoisQuery = async (domain: string): Promise<WhoisInfo> => {
    // 模拟查询延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // 模拟Whois数据
    const mockWhoisInfo: WhoisInfo = {
      domain: domain.toLowerCase(),
      registrar: 'Example Registrar Inc.',
      registrationDate: '2020-01-15T10:30:00Z',
      expirationDate: '2025-01-15T10:30:00Z',
      updatedDate: '2023-11-01T08:15:00Z',
      status: [
        'clientTransferProhibited',
        'clientUpdateProhibited',
        'clientDeleteProhibited'
      ],
      nameServers: [
        'ns1.example.com',
        'ns2.example.com',
        'ns3.example.com',
        'ns4.example.com'
      ],
      registrant: {
        name: 'John Doe',
        organization: 'Example Organization',
        email: 'admin@example.com',
        phone: '+1.1234567890',
        country: 'US',
        state: 'California',
        city: 'San Francisco'
      },
      admin: {
        name: 'Jane Smith',
        organization: 'Example Organization',
        email: 'admin@example.com',
        phone: '+1.1234567890',
        country: 'US',
        state: 'California',
        city: 'San Francisco'
      },
      tech: {
        name: 'Tech Support',
        organization: 'Example Hosting',
        email: 'tech@example.com',
        phone: '+1.9876543210',
        country: 'US',
        state: 'California',
        city: 'Los Angeles'
      },
      dnssec: true,
      rawData: `Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 123456789_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.example.com
Registrar URL: http://www.example.com
Updated Date: 2023-11-01T08:15:00Z
Creation Date: 2020-01-15T10:30:00Z
Registry Expiry Date: 2025-01-15T10:30:00Z
Registrar: Example Registrar Inc.
Registrar IANA ID: 123
Registrar Abuse Contact Email: abuse@example.com
Registrar Abuse Contact Phone: +1.1234567890
Domain Status: clientTransferProhibited
Domain Status: clientUpdateProhibited
Domain Status: clientDeleteProhibited
Name Server: NS1.EXAMPLE.COM
Name Server: NS2.EXAMPLE.COM
Name Server: NS3.EXAMPLE.COM
Name Server: NS4.EXAMPLE.COM
DNSSEC: signedDelegation

Registrant Name: John Doe
Registrant Organization: Example Organization
Registrant Street: 123 Main St
Registrant City: San Francisco
Registrant State/Province: California
Registrant Postal Code: 94102
Registrant Country: US
Registrant Phone: +1.1234567890
Registrant Email: admin@example.com

Admin Name: Jane Smith
Admin Organization: Example Organization
Admin Street: 123 Main St
Admin City: San Francisco
Admin State/Province: California
Admin Postal Code: 94102
Admin Country: US
Admin Phone: +1.1234567890
Admin Email: admin@example.com

Tech Name: Tech Support
Tech Organization: Example Hosting
Tech Street: 456 Tech Ave
Tech City: Los Angeles
Tech State/Province: California
Tech Postal Code: 90210
Tech Country: US
Tech Phone: +1.9876543210
Tech Email: tech@example.com`
    };

    return mockWhoisInfo;
  };

  // 执行Whois查询
  const performWhoisLookup = useCallback(async () => {
    if (!domain.trim()) {
      setError('请输入域名');
      return;
    }

    if (!validateDomain(domain.trim())) {
      setError('请输入有效的域名');
      return;
    }

    setLoading(true);
    setError('');
    setWhoisInfo(null);

    try {
      const whoisData = await simulateWhoisQuery(domain.trim());
      setWhoisInfo(whoisData);
      
      toast({
        title: "查询成功",
        description: `已获取 ${domain.trim()} 的Whois信息`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Whois查询失败';
      setError(errorMessage);
      toast({
        title: "查询失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [domain, toast]);

  // 复制到剪贴板
  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
      
      toast({
        title: "复制成功",
        description: `已复制 ${field} 到剪贴板`,
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  }, [toast]);

  // 格式化日期
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // 计算域名到期天数
  const getDaysUntilExpiry = (expirationDate: string): number => {
    try {
      const expiry = new Date(expirationDate);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performWhoisLookup();
    }
  };

  // 获取域名状态颜色
  const getStatusColor = (status: string) => {
    if (status.includes('Transfer') || status.includes('Update') || status.includes('Delete')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <>
      <SEOHead toolId="whois-lookup" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">Whois查询工具(模拟)</h1>
          </div>
          <p className="text-muted-foreground">
            查询域名的注册信息、到期时间、注册商等详细信息
          </p>
        </div>

        {/* 查询输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              域名Whois查询
            </CardTitle>
            <CardDescription>
              输入域名查询其注册信息，包括注册商、到期时间、联系人等详细信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="domain-input">域名</Label>
                <Input
                  id="domain-input"
                  type="text"
                  placeholder="例如: example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button 
              onClick={performWhoisLookup} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              查询Whois信息
            </Button>
          </CardContent>
        </Card>

        {/* 查询结果 */}
        {whoisInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">域名</Label>
                      <p className="text-lg font-mono">{whoisInfo.domain}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(whoisInfo.domain, '域名')}
                    >
                      {copiedField === '域名' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">注册商</Label>
                    <p className="font-medium">{whoisInfo.registrar}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">注册时间</Label>
                      <p className="font-medium">{formatDate(whoisInfo.registrationDate)}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">更新时间</Label>
                      <p className="font-medium">{formatDate(whoisInfo.updatedDate)}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">到期时间</Label>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{formatDate(whoisInfo.expirationDate)}</p>
                        <Badge 
                          variant={getDaysUntilExpiry(whoisInfo.expirationDate) < 30 ? "destructive" : "outline"}
                        >
                          {getDaysUntilExpiry(whoisInfo.expirationDate)}天后到期
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">DNSSEC</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={whoisInfo.dnssec ? "default" : "outline"}>
                        {whoisInfo.dnssec ? '已启用' : '未启用'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 域名状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  域名状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {whoisInfo.status.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2 block">名称服务器</Label>
                  <div className="space-y-2">
                    {whoisInfo.nameServers.map((ns, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="font-mono text-sm">{ns}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(ns, '名称服务器')}
                        >
                          {copiedField === '名称服务器' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 注册人信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  注册人信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {whoisInfo.registrant.name && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">姓名</Label>
                    <p className="font-medium">{whoisInfo.registrant.name}</p>
                  </div>
                )}
                {whoisInfo.registrant.organization && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">组织</Label>
                    <p className="font-medium">{whoisInfo.registrant.organization}</p>
                  </div>
                )}
                {whoisInfo.registrant.email && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">邮箱</Label>
                    <p className="font-medium">{whoisInfo.registrant.email}</p>
                  </div>
                )}
                {whoisInfo.registrant.phone && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">电话</Label>
                    <p className="font-medium">{whoisInfo.registrant.phone}</p>
                  </div>
                )}
                {whoisInfo.registrant.country && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">国家</Label>
                      <p className="font-medium">{whoisInfo.registrant.country}</p>
                    </div>
                    {whoisInfo.registrant.state && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium">州/省</Label>
                        <p className="font-medium">{whoisInfo.registrant.state}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 管理员信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  管理员信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {whoisInfo.admin.name && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">姓名</Label>
                    <p className="font-medium">{whoisInfo.admin.name}</p>
                  </div>
                )}
                {whoisInfo.admin.organization && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">组织</Label>
                    <p className="font-medium">{whoisInfo.admin.organization}</p>
                  </div>
                )}
                {whoisInfo.admin.email && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">邮箱</Label>
                    <p className="font-medium">{whoisInfo.admin.email}</p>
                  </div>
                )}
                {whoisInfo.admin.phone && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">电话</Label>
                    <p className="font-medium">{whoisInfo.admin.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 原始数据 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  原始Whois数据
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {whoisInfo.rawData}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(whoisInfo.rawData, '原始数据')}
                  >
                    {copiedField === '原始数据' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 帮助信息 */}
        <Card>
          <CardHeader>
            <CardTitle>Whois信息说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><strong>注册商:</strong> 域名注册服务提供商</div>
                <div><strong>注册时间:</strong> 域名首次注册的时间</div>
                <div><strong>到期时间:</strong> 域名需要续费的时间</div>
                <div><strong>更新时间:</strong> 域名信息最后修改时间</div>
              </div>
              <div className="space-y-2">
                <div><strong>域名状态:</strong> 域名当前的保护和限制状态</div>
                <div><strong>名称服务器:</strong> 负责解析该域名的DNS服务器</div>
                <div><strong>DNSSEC:</strong> 域名系统安全扩展，提供DNS查询验证</div>
                <div><strong>联系信息:</strong> 域名注册人、管理员和技术联系人信息</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WhoisLookup;