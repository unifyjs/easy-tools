import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Globe, Server, Copy, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DNSRecord {
  name: string;
  type: string;
  ttl: number;
  data: string;
}

interface DNSResult {
  domain: string;
  records: DNSRecord[];
  queryTime: number;
  server: string;
}

const DNS_RECORD_TYPES = [
  { label: 'A (IPv4地址)', value: 'A' },
  { label: 'AAAA (IPv6地址)', value: 'AAAA' },
  { label: 'CNAME (别名)', value: 'CNAME' },
  { label: 'MX (邮件交换)', value: 'MX' },
  { label: 'NS (名称服务器)', value: 'NS' },
  { label: 'TXT (文本记录)', value: 'TXT' },
  { label: 'SOA (授权开始)', value: 'SOA' },
  { label: 'PTR (反向解析)', value: 'PTR' },
  { label: 'SRV (服务记录)', value: 'SRV' },
  { label: 'CAA (证书颁发机构)', value: 'CAA' },
];

const DNS_SERVERS = [
  { label: 'Google DNS', value: '8.8.8.8' },
  { label: 'Cloudflare DNS', value: '1.1.1.1' },
  { label: 'Quad9 DNS', value: '9.9.9.9' },
  { label: 'OpenDNS', value: '208.67.222.222' },
  { label: '阿里DNS', value: '223.5.5.5' },
  { label: '腾讯DNS', value: '119.29.29.29' },
  { label: '百度DNS', value: '180.76.76.76' },
];

const DnsLookup = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [dnsServer, setDnsServer] = useState('8.8.8.8');
  const [results, setResults] = useState<DNSResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const { toast } = useToast();

  // 验证域名格式
  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return domainRegex.test(domain);
  };

  // 模拟DNS查询（实际应用中需要后端API支持）
  const simulateDNSQuery = async (domain: string, type: string, server: string): Promise<DNSRecord[]> => {
    // 模拟查询延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // 模拟不同类型的DNS记录
    const mockRecords: { [key: string]: DNSRecord[] } = {
      'A': [
        { name: domain, type: 'A', ttl: 300, data: '93.184.216.34' },
        { name: domain, type: 'A', ttl: 300, data: '93.184.216.35' },
      ],
      'AAAA': [
        { name: domain, type: 'AAAA', ttl: 300, data: '2606:2800:220:1:248:1893:25c8:1946' },
      ],
      'CNAME': [
        { name: `www.${domain}`, type: 'CNAME', ttl: 3600, data: domain },
      ],
      'MX': [
        { name: domain, type: 'MX', ttl: 3600, data: '10 mail.example.com' },
        { name: domain, type: 'MX', ttl: 3600, data: '20 mail2.example.com' },
      ],
      'NS': [
        { name: domain, type: 'NS', ttl: 86400, data: 'ns1.example.com' },
        { name: domain, type: 'NS', ttl: 86400, data: 'ns2.example.com' },
      ],
      'TXT': [
        { name: domain, type: 'TXT', ttl: 3600, data: 'v=spf1 include:_spf.google.com ~all' },
        { name: domain, type: 'TXT', ttl: 3600, data: 'google-site-verification=abc123def456' },
      ],
      'SOA': [
        { name: domain, type: 'SOA', ttl: 86400, data: 'ns1.example.com admin.example.com 2023111601 7200 3600 604800 86400' },
      ],
      'CAA': [
        { name: domain, type: 'CAA', ttl: 3600, data: '0 issue "letsencrypt.org"' },
      ],
    };

    return mockRecords[type] || [];
  };

  // 执行DNS查询
  const performDNSLookup = useCallback(async () => {
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

    try {
      const startTime = Date.now();
      const records = await simulateDNSQuery(domain.trim(), recordType, dnsServer);
      const queryTime = Date.now() - startTime;

      const result: DNSResult = {
        domain: domain.trim(),
        records,
        queryTime,
        server: dnsServer,
      };

      setResults(prev => [result, ...prev.slice(0, 4)]); // 保留最近5次查询结果

      if (records.length === 0) {
        toast({
          title: "查询完成",
          description: `未找到 ${domain.trim()} 的 ${recordType} 记录`,
        });
      } else {
        toast({
          title: "查询成功",
          description: `找到 ${records.length} 条 ${recordType} 记录`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'DNS查询失败';
      setError(errorMessage);
      toast({
        title: "查询失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [domain, recordType, dnsServer, toast]);

  // 查询所有记录类型
  const lookupAllRecords = useCallback(async () => {
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

    try {
      const allResults: DNSResult[] = [];
      const commonTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT'];

      for (const type of commonTypes) {
        const startTime = Date.now();
        const records = await simulateDNSQuery(domain.trim(), type, dnsServer);
        const queryTime = Date.now() - startTime;

        if (records.length > 0) {
          allResults.push({
            domain: domain.trim(),
            records,
            queryTime,
            server: dnsServer,
          });
        }
      }

      setResults(allResults);

      toast({
        title: "批量查询完成",
        description: `完成 ${domain.trim()} 的所有记录类型查询`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'DNS查询失败';
      setError(errorMessage);
      toast({
        title: "查询失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [domain, dnsServer, toast]);

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

  // 清除查询结果
  const clearResults = useCallback(() => {
    setResults([]);
    setError('');
    toast({
      title: "已清除",
      description: "查询结果已清除",
    });
  }, [toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performDNSLookup();
    }
  };

  // 获取记录类型的颜色
  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'AAAA': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'CNAME': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'MX': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'NS': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'TXT': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'SOA': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'CAA': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Search className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold">DNS查询工具</h1>
        </div>
        <p className="text-muted-foreground">
          查询域名的DNS记录信息，支持多种记录类型和DNS服务器
        </p>
      </div>

      {/* 查询输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            DNS记录查询
          </CardTitle>
          <CardDescription>
            输入域名查询其DNS记录，支持A、AAAA、CNAME、MX等多种记录类型
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
            
            <div>
              <Label>记录类型</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DNS_RECORD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>DNS服务器</Label>
              <Select value={dnsServer} onValueChange={setDnsServer}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DNS_SERVERS.map((server) => (
                    <SelectItem key={server.value} value={server.value}>
                      {server.label} ({server.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={performDNSLookup} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              查询DNS记录
            </Button>
            <Button 
              variant="outline" 
              onClick={lookupAllRecords}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              查询所有记录
            </Button>
            {results.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearResults}
                disabled={loading}
              >
                清除结果
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 查询结果 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">查询结果</h2>
            <Badge variant="outline">{results.length} 个结果</Badge>
          </div>

          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    {result.domain}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {result.queryTime}ms
                    </Badge>
                    <Badge variant="outline">
                      {result.server}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.records.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>未找到DNS记录</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.records.map((record, recordIndex) => (
                      <div key={recordIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getRecordTypeColor(record.type)}>
                              {record.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              TTL: {record.ttl}s
                            </span>
                          </div>
                          <p className="font-mono text-sm break-all">{record.data}</p>
                          {record.name !== result.domain && (
                            <p className="text-xs text-muted-foreground mt-1">
                              名称: {record.name}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(record.data, `${record.type}记录`)}
                        >
                          {copiedField === `${record.type}记录` ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 帮助信息 */}
      <Card>
        <CardHeader>
          <CardTitle>DNS记录类型说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>A记录:</strong> 将域名指向IPv4地址</div>
              <div><strong>AAAA记录:</strong> 将域名指向IPv6地址</div>
              <div><strong>CNAME记录:</strong> 将域名指向另一个域名</div>
              <div><strong>MX记录:</strong> 指定邮件服务器</div>
              <div><strong>NS记录:</strong> 指定域名服务器</div>
            </div>
            <div className="space-y-2">
              <div><strong>TXT记录:</strong> 存储文本信息，常用于验证</div>
              <div><strong>SOA记录:</strong> 域名授权开始记录</div>
              <div><strong>PTR记录:</strong> 反向DNS解析</div>
              <div><strong>SRV记录:</strong> 服务记录</div>
              <div><strong>CAA记录:</strong> 证书颁发机构授权</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DnsLookup;