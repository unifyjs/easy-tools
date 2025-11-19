import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Globe, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TimezoneConverter = () => {
  const [inputTime, setInputTime] = useState('');
  const [fromTimezone, setFromTimezone] = useState('Asia/Shanghai');
  const [results, setResults] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const timezones = {
    'Asia/Shanghai': '中国标准时间 (CST)',
    'UTC': '协调世界时 (UTC)',
    'America/New_York': '美国东部时间 (EST/EDT)',
    'America/Los_Angeles': '美国西部时间 (PST/PDT)',
    'Europe/London': '英国时间 (GMT/BST)',
    'Europe/Paris': '欧洲中部时间 (CET/CEST)',
    'Asia/Tokyo': '日本标准时间 (JST)',
    'Asia/Seoul': '韩国标准时间 (KST)',
    'Australia/Sydney': '澳大利亚东部时间 (AEST/AEDT)',
    'Asia/Dubai': '阿联酋时间 (GST)',
    'Asia/Kolkata': '印度标准时间 (IST)',
    'Europe/Moscow': '莫斯科时间 (MSK)',
    'America/Chicago': '美国中部时间 (CST/CDT)',
    'America/Denver': '美国山地时间 (MST/MDT)',
    'Pacific/Honolulu': '夏威夷时间 (HST)',
    'Asia/Singapore': '新加坡时间 (SGT)',
    'Asia/Hong_Kong': '香港时间 (HKT)',
    'Europe/Berlin': '德国时间 (CET/CEST)',
    'America/Sao_Paulo': '巴西时间 (BRT)',
    'Africa/Cairo': '埃及时间 (EET)'
  };

  const convertTimezone = (dateStr: string, fromTz: string, toTz: string): string => {
    try {
      let date: Date;
      
      // 尝试解析不同格式的输入
      if (/^\\d{10}$/.test(dateStr)) {
        // 10位时间戳（秒）
        date = new Date(parseInt(dateStr) * 1000);
      } else if (/^\\d{13}$/.test(dateStr)) {
        // 13位时间戳（毫秒）
        date = new Date(parseInt(dateStr));
      } else {
        // 其他格式，假设是源时区的时间
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      // 使用Intl.DateTimeFormat进行时区转换
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: toTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      return formatter.format(date);
    } catch (error) {
      return '转换失败';
    }
  };

  const handleConvert = () => {
    if (!inputTime.trim()) {
      toast({
        title: "输入为空",
        description: "请输入日期时间",
        variant: "destructive",
      });
      return;
    }

    try {
      const convertedResults: {[key: string]: string} = {};
      
      Object.entries(timezones).forEach(([tz, name]) => {
        convertedResults[name] = convertTimezone(inputTime, fromTimezone, tz);
      });

      setResults(convertedResults);
      
      toast({
        title: "转换成功",
        description: "时间已转换为各个时区",
      });
    } catch (error: any) {
      toast({
        title: "转换失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (content: string, timezone: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "复制成功",
        description: `${timezone}时间已复制到剪贴板`,
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制结果",
        variant: "destructive",
      });
    }
  };

  const setCurrentTime = () => {
    const now = new Date();
    setInputTime(now.toISOString().slice(0, 19).replace('T', ' '));
  };

  return (
    <>
      <SEOHead toolId="timezone-converter" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              时区转换器
            </CardTitle>
            <CardDescription>
              将时间在不同时区之间进行转换，支持全球主要时区
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-time">输入时间</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="input-time"
                    placeholder="例如: 2024-01-01 12:00:00 或时间戳"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={setCurrentTime}>
                    <Clock className="w-4 h-4 mr-2" />
                    当前时间
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="from-timezone">源时区</Label>
                <Select value={fromTimezone} onValueChange={setFromTimezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(timezones).map(([tz, name]) => (
                      <SelectItem key={tz} value={tz}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleConvert} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                转换时区
              </Button>
            </div>
          </CardContent>
        </Card>

        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>转换结果</CardTitle>
              <CardDescription>各时区对应的时间</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(results).map(([timezone, time]) => (
                  <div key={timezone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700">{timezone}</div>
                      <div className="font-mono text-sm mt-1">{time}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(time, timezone)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default TimezoneConverter;