import React, { useState, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Scan, Shield, Server, AlertCircle, CheckCircle, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PortResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
  description?: string;
}

interface ScanResult {
  host: string;
  ports: PortResult[];
  scanTime: number;
  totalPorts: number;
  openPorts: number;
}

// 常见端口和服务映射
const COMMON_PORTS = {
  21: { service: 'FTP', description: '文件传输协议' },
  22: { service: 'SSH', description: '安全外壳协议' },
  23: { service: 'Telnet', description: '远程登录协议' },
  25: { service: 'SMTP', description: '简单邮件传输协议' },
  53: { service: 'DNS', description: '域名系统' },
  80: { service: 'HTTP', description: '超文本传输协议' },
  110: { service: 'POP3', description: '邮局协议版本3' },
  143: { service: 'IMAP', description: '互联网消息访问协议' },
  443: { service: 'HTTPS', description: '安全超文本传输协议' },
  993: { service: 'IMAPS', description: '安全IMAP' },
  995: { service: 'POP3S', description: '安全POP3' },
  3389: { service: 'RDP', description: '远程桌面协议' },
  5432: { service: 'PostgreSQL', description: 'PostgreSQL数据库' },
  3306: { service: 'MySQL', description: 'MySQL数据库' },
  1433: { service: 'MSSQL', description: 'Microsoft SQL Server' },
  6379: { service: 'Redis', description: 'Redis数据库' },
  27017: { service: 'MongoDB', description: 'MongoDB数据库' },
};

const PRESET_RANGES = [
  { label: '常用端口', value: '21,22,23,25,53,80,110,143,443,993,995,3389' },
  { label: 'Web服务', value: '80,443,8080,8443,8000,8888,9000' },
  { label: '数据库', value: '3306,5432,1433,6379,27017,5984' },
  { label: '邮件服务', value: '25,110,143,465,587,993,995' },
  { label: '远程服务', value: '22,23,3389,5900,5901' },
];

const PortScanner = () => {
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('80,443,22,21,25,53');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // 验证主机地址格式
  const validateHost = (host: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return ipv4Regex.test(host) || domainRegex.test(host);
  };

  // 解析端口范围
  const parsePortRange = (range: string): number[] => {
    const ports: number[] = [];
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()));
        if (start && end && start <= end && start > 0 && end <= 65535) {
          for (let i = start; i <= end; i++) {
            ports.push(i);
          }
        }
      } else {
        const port = parseInt(trimmed);
        if (port > 0 && port <= 65535) {
          ports.push(port);
        }
      }
    }
    
    return [...new Set(ports)].sort((a, b) => a - b);
  };

  // 模拟端口扫描
  const simulatePortScan = async (host: string, port: number): Promise<PortResult> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    // 模拟端口状态（常用端口更可能开放）
    const isCommonPort = port in COMMON_PORTS;
    const randomFactor = Math.random();
    
    let status: 'open' | 'closed' | 'filtered';
    if (isCommonPort && randomFactor > 0.3) {
      status = 'open';
    } else if (randomFactor > 0.8) {
      status = 'open';
    } else if (randomFactor > 0.1) {
      status = 'closed';
    } else {
      status = 'filtered';
    }
    
    const portInfo = COMMON_PORTS[port as keyof typeof COMMON_PORTS];
    
    return {
      port,
      status,
      service: portInfo?.service,
      description: portInfo?.description,
    };
  };

  // 执行端口扫描
  const performPortScan = useCallback(async () => {
    if (!host.trim()) {
      setError('请输入主机地址');
      return;
    }

    if (!validateHost(host.trim())) {
      setError('请输入有效的主机地址或域名');
      return;
    }

    const ports = parsePortRange(portRange);
    if (ports.length === 0) {
      setError('请输入有效的端口范围');
      return;
    }

    if (ports.length > 1000) {
      setError('端口数量不能超过1000个');
      return;
    }

    setScanning(true);
    setError('');
    setProgress(0);

    try {
      const startTime = Date.now();
      const portResults: PortResult[] = [];
      
      for (let i = 0; i < ports.length; i++) {
        const port = ports[i];
        const result = await simulatePortScan(host.trim(), port);
        portResults.push(result);
        
        // 更新进度
        setProgress(((i + 1) / ports.length) * 100);
      }

      const scanTime = Date.now() - startTime;
      const openPorts = portResults.filter(p => p.status === 'open').length;

      const scanResult: ScanResult = {
        host: host.trim(),
        ports: portResults,
        scanTime,
        totalPorts: ports.length,
        openPorts,
      };

      setResults(prev => [scanResult, ...prev.slice(0, 4)]); // 保留最近5次扫描结果

      toast({
        title: "扫描完成",
        description: `发现 ${openPorts} 个开放端口，共扫描 ${ports.length} 个端口`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '端口扫描失败';
      setError(errorMessage);
      toast({
        title: "扫描失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setScanning(false);
      setProgress(0);
    }
  }, [host, portRange, toast]);

  // 设置预设端口范围
  const setPresetRange = useCallback((range: string) => {
    setPortRange(range);
  }, []);

  // 清除扫描结果
  const clearResults = useCallback(() => {
    setResults([]);
    setError('');
    toast({
      title: "已清除",
      description: "扫描结果已清除",
    });
  }, [toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !scanning) {
      performPortScan();
    }
  };

  // 获取端口状态颜色
  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'filtered':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // 获取端口状态图标
  const getPortStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'filtered':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <SEOHead toolId="port-scanner" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Scan className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">端口扫描工具(模拟)</h1>
          </div>
          <p className="text-muted-foreground">
            扫描主机的开放端口，检测网络服务状态
          </p>
        </div>

        {/* 扫描输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              端口扫描配置
            </CardTitle>
            <CardDescription>
              输入主机地址和端口范围进行扫描，支持IP地址和域名
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host-input">主机地址</Label>
                <Input
                  id="host-input"
                  type="text"
                  placeholder="例如: 192.168.1.1 或 example.com"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                  disabled={scanning}
                />
              </div>
              
              <div>
                <Label htmlFor="port-range">端口范围</Label>
                <Input
                  id="port-range"
                  type="text"
                  placeholder="例如: 80,443,22-25,3000-3010"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                  disabled={scanning}
                />
              </div>
            </div>

            {/* 预设端口范围 */}
            <div>
              <Label>快速选择</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_RANGES.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange(preset.value)}
                    disabled={scanning}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {scanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>扫描进度</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={performPortScan} 
                disabled={scanning}
                className="flex-1"
              >
                {scanning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Scan className="w-4 h-4 mr-2" />
                )}
                {scanning ? '扫描中...' : '开始扫描'}
              </Button>
              {results.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearResults}
                  disabled={scanning}
                >
                  清除结果
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 扫描结果 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">扫描结果</h2>
              <Badge variant="outline">{results.length} 个结果</Badge>
            </div>

            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {result.host}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {result.openPorts}/{result.totalPorts} 开放
                      </Badge>
                      <Badge variant="outline">
                        {result.scanTime}ms
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.ports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>未扫描到端口</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* 开放端口 */}
                      {result.ports.filter(p => p.status === 'open').length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            开放端口 ({result.ports.filter(p => p.status === 'open').length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {result.ports
                              .filter(p => p.status === 'open')
                              .map((port, portIndex) => (
                                <div key={portIndex} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    {getPortStatusIcon(port.status)}
                                    <span className="font-mono font-medium">{port.port}</span>
                                    {port.service && (
                                      <Badge variant="outline" className="text-xs">
                                        {port.service}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* 关闭端口 */}
                      {result.ports.filter(p => p.status === 'closed').length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            关闭端口 ({result.ports.filter(p => p.status === 'closed').length})
                          </h4>
                          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1">
                            {result.ports
                              .filter(p => p.status === 'closed')
                              .slice(0, 24) // 只显示前24个关闭端口
                              .map((port, portIndex) => (
                                <div key={portIndex} className="text-center p-1 bg-red-50 dark:bg-red-900/20 rounded text-xs font-mono">
                                  {port.port}
                                </div>
                              ))}
                            {result.ports.filter(p => p.status === 'closed').length > 24 && (
                              <div className="text-center p-1 bg-gray-50 dark:bg-gray-900/20 rounded text-xs">
                                +{result.ports.filter(p => p.status === 'closed').length - 24}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 过滤端口 */}
                      {result.ports.filter(p => p.status === 'filtered').length > 0 && (
                        <div>
                          <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            过滤端口 ({result.ports.filter(p => p.status === 'filtered').length})
                          </h4>
                          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1">
                            {result.ports
                              .filter(p => p.status === 'filtered')
                              .map((port, portIndex) => (
                                <div key={portIndex} className="text-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs font-mono">
                                  {port.port}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
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
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">端口范围格式：</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• 单个端口：80</li>
                  <li>• 多个端口：80,443,22</li>
                  <li>• 端口范围：22-25,3000-3010</li>
                  <li>• 混合格式：80,443,22-25,3000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">端口状态说明：</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• <span className="text-green-600">开放</span>：端口正在监听连接</li>
                  <li>• <span className="text-red-600">关闭</span>：端口未开放或服务未运行</li>
                  <li>• <span className="text-yellow-600">过滤</span>：端口被防火墙过滤</li>
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>注意：此工具仅用于网络诊断和安全测试，请勿用于非法用途。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PortScanner;