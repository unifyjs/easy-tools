import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DateValidator = () => {
  const [inputDate, setInputDate] = useState('');
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    format: string;
    parsedDate?: Date;
    errors: string[];
    suggestions: string[];
  } | null>(null);
  const { toast } = useToast();

  const dateFormats = [
    { pattern: /^\d{4}-\d{2}-\d{2}$/, name: 'YYYY-MM-DD', example: '2024-01-01' },
    { pattern: /^\d{4}\/\d{2}\/\d{2}$/, name: 'YYYY/MM/DD', example: '2024/01/01' },
    { pattern: /^\d{2}\/\d{2}\/\d{4}$/, name: 'MM/DD/YYYY', example: '01/01/2024' },
    { pattern: /^\d{2}-\d{2}-\d{4}$/, name: 'DD-MM-YYYY', example: '01-01-2024' },
    { pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, name: 'ISO 8601', example: '2024-01-01T12:00:00' },
    { pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, name: 'YYYY-MM-DD HH:mm:ss', example: '2024-01-01 12:00:00' },
    { pattern: /^\d{10}$/, name: '时间戳(秒)', example: '1704067200' },
    { pattern: /^\d{13}$/, name: '时间戳(毫秒)', example: '1704067200000' },
  ];

  const validateDate = () => {
    if (!inputDate.trim()) {
      toast({
        title: "输入为空",
        description: "请输入日期字符串",
        variant: "destructive",
      });
      return;
    }

    const errors: string[] = [];
    const suggestions: string[] = [];
    let isValid = false;
    let parsedDate: Date | undefined;
    let detectedFormat = '未知格式';

    try {
      // 检测格式
      for (const format of dateFormats) {
        if (format.pattern.test(inputDate.trim())) {
          detectedFormat = format.name;
          break;
        }
      }

      // 尝试解析日期
      let date: Date;
      
      if (/^\d{10}$/.test(inputDate)) {
        // 10位时间戳（秒）
        date = new Date(parseInt(inputDate) * 1000);
      } else if (/^\d{13}$/.test(inputDate)) {
        // 13位时间戳（毫秒）
        date = new Date(parseInt(inputDate));
      } else {
        // 其他格式
        date = new Date(inputDate);
      }

      if (isNaN(date.getTime())) {
        errors.push('无法解析为有效日期');
        suggestions.push('请检查日期格式是否正确');
      } else {
        parsedDate = date;
        isValid = true;

        // 检查日期合理性
        const year = date.getFullYear();
        if (year < 1900 || year > 2100) {
          errors.push(`年份 ${year} 可能不合理`);
          suggestions.push('请检查年份是否正确');
        }

        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 检查月份
        if (month < 1 || month > 12) {
          errors.push(`月份 ${month} 无效`);
        }

        // 检查日期
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
          errors.push(`${year}年${month}月没有${day}日`);
        }

        // 检查是否为未来日期
        const now = new Date();
        if (date > now) {
          suggestions.push('这是一个未来日期');
        } else if (date < new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)) {
          suggestions.push('这是一个较早的历史日期');
        }

        // 检查是否为闰年
        if (month === 2 && day === 29) {
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          if (!isLeapYear) {
            errors.push(`${year}年不是闰年，2月没有29日`);
          } else {
            suggestions.push(`${year}年是闰年`);
          }
        }

        // 检查星期
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        suggestions.push(`这一天是${weekdays[date.getDay()]}`);
      }

      // 格式建议
      if (detectedFormat === '未知格式') {
        suggestions.push('建议使用标准格式如: YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss');
        dateFormats.forEach(format => {
          suggestions.push(`${format.name}: ${format.example}`);
        });
      }

    } catch (error: any) {
      errors.push('解析错误: ' + error.message);
      suggestions.push('请检查输入格式');
    }

    setValidationResults({
      isValid: isValid && errors.length === 0,
      format: detectedFormat,
      parsedDate,
      errors,
      suggestions
    });

    toast({
      title: isValid && errors.length === 0 ? "验证成功" : "验证完成",
      description: isValid && errors.length === 0 ? "日期格式有效" : "发现一些问题",
      variant: isValid && errors.length === 0 ? "default" : "destructive",
    });
  };

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制结果",
        variant: "destructive",
      });
    }
  };

  const setExampleDate = (example: string) => {
    setInputDate(example);
  };

  return (
    <>
      <SEOHead toolId="date-validator" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              日期验证器
            </CardTitle>
            <CardDescription>
              验证日期格式的正确性，检测常见错误并提供建议
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-date">输入日期</Label>
                <Input
                  id="input-date"
                  placeholder="例如: 2024-01-01, 01/01/2024, 1704067200"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button onClick={validateDate} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                验证日期
              </Button>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">示例格式</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {dateFormats.map((format, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setExampleDate(format.example)}
                      className="text-xs justify-start"
                    >
                      {format.example}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {validationResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationResults.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                验证结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={validationResults.isValid ? "default" : "destructive"}>
                    {validationResults.isValid ? "有效" : "无效"}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    检测格式: {validationResults.format}
                  </span>
                </div>

                {validationResults.parsedDate && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">解析结果</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>标准格式:</span>
                        <span className="font-mono">{validationResults.parsedDate.toISOString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(validationResults.parsedDate!.toISOString(), '标准格式')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>本地格式:</span>
                        <span className="font-mono">{validationResults.parsedDate.toLocaleString('zh-CN')}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(validationResults.parsedDate!.toLocaleString('zh-CN'), '本地格式')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>时间戳(秒):</span>
                        <span className="font-mono">{Math.floor(validationResults.parsedDate.getTime() / 1000)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(Math.floor(validationResults.parsedDate!.getTime() / 1000).toString(), '时间戳')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>时间戳(毫秒):</span>
                        <span className="font-mono">{validationResults.parsedDate.getTime()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(validationResults.parsedDate!.getTime().toString(), '毫秒时间戳')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {validationResults.errors.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">发现的问题</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      {validationResults.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResults.suggestions.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">建议和提示</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {validationResults.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default DateValidator;