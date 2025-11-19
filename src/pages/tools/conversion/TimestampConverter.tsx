import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Copy, RefreshCw, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 时区配置
const timezones = [
  { value: 'UTC', label: 'UTC (协调世界时)', offset: 0 },
  { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)', offset: 8 },
  { value: 'America/New_York', label: '纽约时间 (EST/EDT)', offset: -5 },
  { value: 'America/Los_Angeles', label: '洛杉矶时间 (PST/PDT)', offset: -8 },
  { value: 'Europe/London', label: '伦敦时间 (GMT/BST)', offset: 0 },
  { value: 'Europe/Paris', label: '巴黎时间 (CET/CEST)', offset: 1 },
  { value: 'Asia/Tokyo', label: '东京时间 (JST)', offset: 9 },
  { value: 'Asia/Seoul', label: '首尔时间 (KST)', offset: 9 },
  { value: 'Australia/Sydney', label: '悉尼时间 (AEST/AEDT)', offset: 10 },
];

// 时间戳格式配置
const timestampFormats = [
  { value: 'seconds', label: '秒级时间戳 (10位)', description: '1699123456' },
  { value: 'milliseconds', label: '毫秒级时间戳 (13位)', description: '1699123456789' },
  { value: 'microseconds', label: '微秒级时间戳 (16位)', description: '1699123456789000' },
  { value: 'nanoseconds', label: '纳秒级时间戳 (19位)', description: '1699123456789000000' },
];

// 日期格式配置
const dateFormats = [
  { value: 'iso', label: 'ISO 8601', example: '2023-11-05T12:30:56.789Z' },
  { value: 'rfc2822', label: 'RFC 2822', example: 'Sun, 05 Nov 2023 12:30:56 GMT' },
  { value: 'locale', label: '本地格式', example: '2023/11/5 12:30:56' },
  { value: 'custom', label: '自定义格式', example: 'YYYY-MM-DD HH:mm:ss' },
];

// 工具函数
const formatTimestamp = (timestamp: number, format: string): number => {
  switch (format) {
    case 'seconds':
      return Math.floor(timestamp / 1000);
    case 'milliseconds':
      return timestamp;
    case 'microseconds':
      return timestamp * 1000;
    case 'nanoseconds':
      return timestamp * 1000000;
    default:
      return timestamp;
  }
};

const parseTimestamp = (value: string, format: string): number => {
  const num = parseInt(value);
  if (isNaN(num)) return Date.now();
  
  switch (format) {
    case 'seconds':
      return num * 1000;
    case 'milliseconds':
      return num;
    case 'microseconds':
      return Math.floor(num / 1000);
    case 'nanoseconds':
      return Math.floor(num / 1000000);
    default:
      return num;
  }
};

const formatDate = (date: Date, format: string, timezone: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'rfc2822':
        return date.toUTCString();
      case 'locale':
        return new Intl.DateTimeFormat('zh-CN', options).format(date).replace(/\//g, '/').replace(/,/g, '');
      case 'custom':
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      default:
        return date.toString();
    }
  } catch (error) {
    return '格式化错误';
  }
};

const TimestampConverter = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timestampInput, setTimestampInput] = useState('');
  const [timestampFormat, setTimestampFormat] = useState('seconds');
  const [dateInput, setDateInput] = useState('');
  const [dateFormat, setDateFormat] = useState('iso');
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');
  const { toast } = useToast();

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期
  useEffect(() => {
    if (timestampInput.trim()) {
      try {
        const timestamp = parseTimestamp(timestampInput, timestampFormat);
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          setConvertedDate('无效的时间戳');
        } else {
          setConvertedDate(formatDate(date, dateFormat, timezone));
        }
      } catch (error) {
        setConvertedDate('转换错误');
      }
    } else {
      setConvertedDate('');
    }
  }, [timestampInput, timestampFormat, dateFormat, timezone]);

  // 日期转时间戳
  useEffect(() => {
    if (dateInput.trim()) {
      try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
          setConvertedTimestamp('无效的日期格式');
        } else {
          const timestamp = formatTimestamp(date.getTime(), timestampFormat);
          setConvertedTimestamp(timestamp.toString());
        }
      } catch (error) {
        setConvertedTimestamp('转换错误');
      }
    } else {
      setConvertedTimestamp('');
    }
  }, [dateInput, timestampFormat]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  const getCurrentTimestamp = (format: string) => {
    return formatTimestamp(currentTime, format).toString();
  };

  const insertCurrentTime = () => {
    setTimestampInput(getCurrentTimestamp(timestampFormat));
  };

  const insertCurrentDate = () => {
    const now = new Date();
    setDateInput(formatDate(now, dateFormat, timezone));
  };

  const clearAll = () => {
    setTimestampInput('');
    setDateInput('');
    setConvertedDate('');
    setConvertedTimestamp('');
  };

  return (
  <>
      <SEOHead toolId="timestamp-converter" />
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">时间戳转换</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                支持多种时间戳格式与日期时间之间的相互转换，包含时区处理
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="mb-4">转换工具</Badge>
        </div>

        {/* 当前时间显示 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              当前时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {timestampFormats.map((format) => (
                <div key={format.value} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {format.label}
                  </div>
                  <div className="font-mono text-sm font-medium flex items-center justify-between">
                    <span className="truncate mr-2">{getCurrentTimestamp(format.value)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleCopy(getCurrentTimestamp(format.value))}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">当前日期时间</div>
              <div className="font-medium text-blue-800 dark:text-blue-300">
                {formatDate(new Date(currentTime), 'custom', timezone)} ({timezone})
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 转换器主体 */}
        <Tabs defaultValue="timestamp-to-date" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timestamp-to-date" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              时间戳转日期
            </TabsTrigger>
            <TabsTrigger value="date-to-timestamp" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              日期转时间戳
            </TabsTrigger>
          </TabsList>

          {/* 时间戳转日期 */}
          <TabsContent value="timestamp-to-date">
            <Card>
              <CardHeader>
                <CardTitle>时间戳转日期时间</CardTitle>
                <CardDescription>
                  输入时间戳，转换为可读的日期时间格式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 输入区域 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="timestamp-input">时间戳输入</Label>
                    <div className="space-y-2">
                      <Input
                        id="timestamp-input"
                        placeholder="请输入时间戳"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                        className="font-mono"
                      />
                      <Select value={timestampFormat} onValueChange={setTimestampFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timestampFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              <div>
                                <div>{format.label}</div>
                                <div className="text-xs text-gray-500">示例: {format.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={insertCurrentTime}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        使用当前时间戳
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="converted-date">转换结果</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          id="converted-date"
                          value={convertedDate}
                          readOnly
                          className="bg-gray-50 dark:bg-gray-800 font-mono"
                          placeholder="转换结果将显示在这里"
                        />
                        {convertedDate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                            onClick={() => handleCopy(convertedDate)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormats.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                <div>
                                  <div>{format.label}</div>
                                  <div className="text-xs text-gray-500">{format.example}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 日期转时间戳 */}
          <TabsContent value="date-to-timestamp">
            <Card>
              <CardHeader>
                <CardTitle>日期时间转时间戳</CardTitle>
                <CardDescription>
                  输入日期时间，转换为时间戳格式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 输入区域 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="date-input">日期时间输入</Label>
                    <div className="space-y-2">
                      <Input
                        id="date-input"
                        placeholder="请输入日期时间"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="font-mono"
                      />
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dateFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              <div>
                                <div>{format.label}</div>
                                <div className="text-xs text-gray-500">{format.example}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={insertCurrentDate}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        使用当前时间
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="converted-timestamp">转换结果</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          id="converted-timestamp"
                          value={convertedTimestamp}
                          readOnly
                          className="bg-gray-50 dark:bg-gray-800 font-mono"
                          placeholder="转换结果将显示在这里"
                        />
                        {convertedTimestamp && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                            onClick={() => handleCopy(convertedTimestamp)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <Select value={timestampFormat} onValueChange={setTimestampFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timestampFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              <div>
                                <div>{format.label}</div>
                                <div className="text-xs text-gray-500">示例: {format.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={clearAll}>
            清空所有
          </Button>
        </div>

        {/* 帮助信息 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">支持的时间戳格式</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>秒级时间戳</strong>：10位数字，如 1699123456</li>
                  <li>• <strong>毫秒级时间戳</strong>：13位数字，如 1699123456789</li>
                  <li>• <strong>微秒级时间戳</strong>：16位数字，如 1699123456789000</li>
                  <li>• <strong>纳秒级时间戳</strong>：19位数字，如 1699123456789000000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">支持的日期格式</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>ISO 8601</strong>：2023-11-05T12:30:56.789Z</li>
                  <li>• <strong>RFC 2822</strong>：Sun, 05 Nov 2023 12:30:56 GMT</li>
                  <li>• <strong>本地格式</strong>：2023/11/5 12:30:56</li>
                  <li>• <strong>自定义格式</strong>：YYYY-MM-DD HH:mm:ss</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>提示：</strong>时间戳转换会根据选择的时区进行调整。日期输入支持多种格式，系统会自动识别。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default TimestampConverter;