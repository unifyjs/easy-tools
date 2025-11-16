import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Search, Globe, Shield, Clock, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  continent: string;
  continent_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  asn: string;
  org: string;
  isp: string;
  type: string;
  threat: {
    is_tor: boolean;
    is_proxy: boolean;
    is_anonymous: boolean;
    is_known_attacker: boolean;
    is_known_abuser: boolean;
    is_threat: boolean;
    is_bogon: boolean;
  };
}

const IpLookup = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const { toast } = useToast();

  // 验证IP地址格式
  const validateIP = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  // 获取用户当前IP
  const getCurrentIP = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) throw new Error('获取IP失败');
      
      const data = await response.json();
      setIpAddress(data.ip);
      
      toast({
        title: "获取成功",
        description: `当前IP地址: ${data.ip}`,
      });
    } catch (err) {
      setError('获取当前IP地址失败');
      toast({
        title: "获取失败",
        description: "无法获取当前IP地址",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 查询IP信息
  const lookupIP = useCallback(async () => {
    if (!ipAddress.trim()) {
      setError('请输入IP地址');
      return;
    }

    if (!validateIP(ipAddress.trim())) {
      setError('请输入有效的IP地址');
      return;
    }

    setLoading(true);
    setError('');
    setIpInfo(null);

    try {
      // 使用免费的IP查询API
      const response = await fetch(`https://ipapi.co/${ipAddress.trim()}/json/`);
      
      if (!response.ok) {
        throw new Error('查询失败');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || '查询失败');
      }

      // 转换数据格式
      const ipInfo: IPInfo = {
        ip: data.ip || ipAddress.trim(),
        city: data.city || '未知',
        region: data.region || '未知',
        country: data.country_name || '未知',
        country_code: data.country_code || '',
        continent: data.continent_code || '未知',
        continent_code: data.continent_code || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        timezone: data.timezone || '未知',
        utc_offset: data.utc_offset || '未知',
        country_calling_code: data.country_calling_code || '未知',
        currency: data.currency || '未知',
        currency_name: data.currency_name || '未知',
        languages: data.languages || '未知',
        asn: data.asn || '未知',
        org: data.org || '未知',
        isp: data.org || '未知',
        type: data.connection?.type || '未知',
        threat: {
          is_tor: false,
          is_proxy: false,
          is_anonymous: false,
          is_known_attacker: false,
          is_known_abuser: false,
          is_threat: false,
          is_bogon: false,
        }
      };

      setIpInfo(ipInfo);
      
      toast({
        title: "查询成功",
        description: `已获取 ${ipAddress.trim()} 的详细信息`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查询失败';
      setError(errorMessage);
      toast({
        title: "查询失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [ipAddress, toast]);

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

  // 在地图中查看
  const viewOnMap = useCallback(() => {
    if (ipInfo && ipInfo.latitude && ipInfo.longitude) {
      const url = `https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`;
      window.open(url, '_blank');
    }
  }, [ipInfo]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      lookupIP();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold">IP地址查询工具</h1>
        </div>
        <p className="text-muted-foreground">
          查询IP地址的地理位置、ISP信息和其他详细信息
        </p>
      </div>

      {/* 查询输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            IP地址查询
          </CardTitle>
          <CardDescription>
            输入IPv4或IPv6地址进行查询，或获取当前设备的IP地址
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="ip-input">IP地址</Label>
              <Input
                id="ip-input"
                type="text"
                placeholder="例如: 8.8.8.8 或 2001:4860:4860::8888"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
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

          <div className="flex gap-2">
            <Button 
              onClick={lookupIP} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              查询IP信息
            </Button>
            <Button 
              variant="outline" 
              onClick={getCurrentIP}
              disabled={loading}
            >
              <Globe className="w-4 h-4 mr-2" />
              获取当前IP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 查询结果 */}
      {ipInfo && (
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
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">IP地址</Label>
                    <p className="text-lg font-mono">{ipInfo.ip}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(ipInfo.ip, 'IP地址')}
                  >
                    {copiedField === 'IP地址' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">城市</Label>
                    <p className="font-medium">{ipInfo.city}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">地区</Label>
                    <p className="font-medium">{ipInfo.region}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">国家</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{ipInfo.country}</p>
                      {ipInfo.country_code && (
                        <Badge variant="outline">{ipInfo.country_code}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">大洲</Label>
                    <p className="font-medium">{ipInfo.continent}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 地理位置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                地理位置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">纬度</Label>
                  <p className="font-mono">{ipInfo.latitude}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">经度</Label>
                  <p className="font-mono">{ipInfo.longitude}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">时区</Label>
                  <p className="font-medium">{ipInfo.timezone}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">UTC偏移</Label>
                  <p className="font-mono">{ipInfo.utc_offset}</p>
                </div>
              </div>

              {ipInfo.latitude && ipInfo.longitude && (
                <Button 
                  onClick={viewOnMap} 
                  variant="outline" 
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  在地图中查看
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 网络信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                网络信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">ISP/组织</Label>
                  <p className="font-medium">{ipInfo.org}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">ASN</Label>
                  <p className="font-mono">{ipInfo.asn}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">连接类型</Label>
                  <p className="font-medium">{ipInfo.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 其他信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                其他信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">货币</Label>
                    <p className="font-medium">{ipInfo.currency}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">电话代码</Label>
                    <p className="font-mono">{ipInfo.country_calling_code}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">语言</Label>
                  <p className="font-medium">{ipInfo.languages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IpLookup;