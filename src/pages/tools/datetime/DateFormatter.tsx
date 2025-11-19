import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Calendar, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DateFormatter = () => {
  const [inputDate, setInputDate] = useState('');
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss');
  const [results, setResults] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const formatPatterns = {
    'ISO 8601': 'YYYY-MM-DDTHH:mm:ss.sssZ',
    '中文日期': 'YYYY年MM月DD日 HH时mm分ss秒',
    '美式日期': 'MM/DD/YYYY HH:mm:ss',
    '欧式日期': 'DD/MM/YYYY HH:mm:ss',
    '简短日期': 'YYYY-MM-DD',
    '时间戳': 'X',
    '毫秒时间戳': 'x',
    'RFC 2822': 'ddd, DD MMM YYYY HH:mm:ss ZZ',
    '相对时间': 'fromNow'
  };

  const formatDate = (date: Date, pattern: string): string => {
    if (pattern === 'fromNow') {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `${days}天前`;
      if (hours > 0) return `${hours}小时前`;
      if (minutes > 0) return `${minutes}分钟前`;
      return `${seconds}秒前`;
    }
    
    if (pattern === 'X') return Math.floor(date.getTime() / 1000).toString();
    if (pattern === 'x') return date.getTime().toString();
    
    // 简单的格式化实现
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return pattern
      .replace(/YYYY/g, year.toString())
      .replace(/MM/g, month)
      .replace(/DD/g, day)
      .replace(/HH/g, hours)
      .replace(/mm/g, minutes)
      .replace(/ss/g, seconds)
      .replace(/sss/g, milliseconds)
      .replace(/ddd/g, weekdays[date.getDay()])
      .replace(/MMM/g, months[date.getMonth()])
      .replace(/ZZ/g, '+0800');
  };

  const handleFormat = () => {
    if (!inputDate.trim()) {
      toast({
        title: "输入为空",
        description: "请输入日期时间",
        variant: "destructive",
      });
      return;
    }

    try {
      let date: Date;
      
      // 尝试解析不同格式的输入
      if (/^\\d{10}$/.test(inputDate)) {
        // 10位时间戳（秒）
        date = new Date(parseInt(inputDate) * 1000);
      } else if (/^\\d{13}$/.test(inputDate)) {
        // 13位时间戳（毫秒）
        date = new Date(parseInt(inputDate));
      } else {
        // 其他格式
        date = new Date(inputDate);
      }

      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      const formattedResults: {[key: string]: string} = {};
      
      Object.entries(formatPatterns).forEach(([name, pattern]) => {
        formattedResults[name] = formatDate(date, pattern);
      });
      
      // 添加自定义格式
      if (customFormat) {
        formattedResults['自定义格式'] = formatDate(date, customFormat);
      }

      setResults(formattedResults);
      
      toast({
        title: "格式化成功",
        description: "日期已转换为多种格式",
      });
    } catch (error: any) {
      toast({
        title: "格式化失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (content: string, format: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "复制成功",
        description: `${format}已复制到剪贴板`,
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
    setInputDate(now.toISOString());
  };

  return (
    <>
      <SEOHead toolId="date-formatter" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              日期格式化工具
            </CardTitle>
            <CardDescription>
              将日期时间转换为多种常用格式，支持时间戳、ISO格式等
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-date">输入日期时间</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="input-date"
                    placeholder="例如: 2024-01-01 12:00:00 或 1704067200 或 2024-01-01T12:00:00Z"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={setCurrentTime}>
                    <Clock className="w-4 h-4 mr-2" />
                    当前时间
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="custom-format">自定义格式</Label>
                <Input
                  id="custom-format"
                  placeholder="例如: YYYY年MM月DD日 HH:mm:ss"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  支持格式：YYYY(年) MM(月) DD(日) HH(时) mm(分) ss(秒) sss(毫秒)
                </p>
              </div>

              <Button onClick={handleFormat} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                格式化日期
              </Button>
            </div>
          </CardContent>
        </Card>

        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>格式化结果</CardTitle>
              <CardDescription>点击复制按钮可复制对应格式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(results).map(([format, value]) => (
                  <div key={format} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700">{format}</div>
                      <div className="font-mono text-sm mt-1">{value}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(value, format)}
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

export default DateFormatter;