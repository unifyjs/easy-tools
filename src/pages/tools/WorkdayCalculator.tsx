import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, Copy, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkdayCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [workdays, setWorkdays] = useState('');
  const [country, setCountry] = useState('china');
  const [diffResult, setDiffResult] = useState<{
    totalDays: number;
    workdays: number;
    weekends: number;
    holidays: number;
  } | null>(null);
  const [addResult, setAddResult] = useState('');
  const { toast } = useToast();

  const countries = {
    'china': '中国',
    'usa': '美国',
    'uk': '英国',
    'japan': '日本',
    'germany': '德国'
  };

  // 简化的节假日数据（实际应用中应该使用完整的节假日API）
  const holidays = {
    china: [
      '2024-01-01', // 元旦
      '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16', // 春节
      '2024-04-04', '2024-04-05', '2024-04-06', // 清明节
      '2024-05-01', '2024-05-02', '2024-05-03', // 劳动节
      '2024-06-10', // 端午节
      '2024-09-15', '2024-09-16', '2024-09-17', // 中秋节
      '2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', '2024-10-05', '2024-10-06', '2024-10-07', // 国庆节
    ],
    usa: [
      '2024-01-01', // New Year's Day
      '2024-01-15', // Martin Luther King Jr. Day
      '2024-02-19', // Presidents' Day
      '2024-05-27', // Memorial Day
      '2024-07-04', // Independence Day
      '2024-09-02', // Labor Day
      '2024-10-14', // Columbus Day
      '2024-11-11', // Veterans Day
      '2024-11-28', // Thanksgiving
      '2024-12-25', // Christmas
    ],
    uk: [
      '2024-01-01', // New Year's Day
      '2024-03-29', // Good Friday
      '2024-04-01', // Easter Monday
      '2024-05-06', // Early May Bank Holiday
      '2024-05-27', // Spring Bank Holiday
      '2024-08-26', // Summer Bank Holiday
      '2024-12-25', // Christmas Day
      '2024-12-26', // Boxing Day
    ],
    japan: [
      '2024-01-01', // 元日
      '2024-01-08', // 成人の日
      '2024-02-11', // 建国記念の日
      '2024-02-23', // 天皇誕生日
      '2024-03-20', // 春分の日
      '2024-04-29', // 昭和の日
      '2024-05-03', // 憲法記念日
      '2024-05-04', // みどりの日
      '2024-05-05', // こどもの日
      '2024-07-15', // 海の日
      '2024-08-11', // 山の日
      '2024-09-16', // 敬老の日
      '2024-09-23', // 秋分の日
      '2024-10-14', // スポーツの日
      '2024-11-03', // 文化の日
      '2024-11-23', // 勤労感謝の日
    ],
    germany: [
      '2024-01-01', // Neujahr
      '2024-03-29', // Karfreitag
      '2024-04-01', // Ostermontag
      '2024-05-01', // Tag der Arbeit
      '2024-05-09', // Christi Himmelfahrt
      '2024-05-20', // Pfingstmontag
      '2024-10-03', // Tag der Deutschen Einheit
      '2024-12-25', // 1. Weihnachtsfeiertag
      '2024-12-26', // 2. Weihnachtsfeiertag
    ]
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isHoliday = (date: Date, countryCode: string): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays[countryCode as keyof typeof holidays]?.includes(dateStr) || false;
  };

  const calculateWorkdays = () => {
    if (!startDate || !endDate) {
      toast({
        title: "输入不完整",
        description: "请输入开始日期和结束日期",
        variant: "destructive",
      });
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('无效的日期格式');
      }

      if (start > end) {
        throw new Error('开始日期不能晚于结束日期');
      }

      let totalDays = 0;
      let workdayCount = 0;
      let weekendCount = 0;
      let holidayCount = 0;

      const current = new Date(start);
      while (current <= end) {
        totalDays++;
        
        if (isHoliday(current, country)) {
          holidayCount++;
        } else if (isWeekend(current)) {
          weekendCount++;
        } else {
          workdayCount++;
        }
        
        current.setDate(current.getDate() + 1);
      }

      setDiffResult({
        totalDays,
        workdays: workdayCount,
        weekends: weekendCount,
        holidays: holidayCount
      });
      
      toast({
        title: "计算成功",
        description: "工作日统计已完成",
      });
    } catch (error: any) {
      toast({
        title: "计算失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addWorkdays = () => {
    if (!baseDate || !workdays) {
      toast({
        title: "输入不完整",
        description: "请输入基准日期和工作日天数",
        variant: "destructive",
      });
      return;
    }

    try {
      const base = new Date(baseDate);
      const days = parseInt(workdays);

      if (isNaN(base.getTime()) || isNaN(days)) {
        throw new Error('无效的输入格式');
      }

      let current = new Date(base);
      let remainingDays = days;

      while (remainingDays > 0) {
        current.setDate(current.getDate() + 1);
        
        if (!isWeekend(current) && !isHoliday(current, country)) {
          remainingDays--;
        }
      }

      setAddResult(current.toISOString().split('T')[0]);
      
      toast({
        title: "计算成功",
        description: "工作日加法已完成",
      });
    } catch (error: any) {
      toast({
        title: "计算失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content.toString());
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

  const setCurrentDate = (setter: (value: string) => void) => {
    const now = new Date();
    setter(now.toISOString().split('T')[0]);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              工作日计算器
            </CardTitle>
            <CardDescription>
              计算两个日期之间的工作日天数，支持多国节假日
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="country">国家/地区</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countries).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">工作日统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">开始日期</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentDate(setStartDate)}
                      >
                        今天
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="end-date">结束日期</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentDate(setEndDate)}
                      >
                        今天
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateWorkdays} className="w-full mt-4">
                  <Calculator className="w-4 h-4 mr-2" />
                  计算工作日
                </Button>

                {diffResult && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">统计结果</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600">总天数</div>
                        <div className="text-xl font-bold text-blue-700">{diffResult.totalDays}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(diffResult.totalDays.toString(), '总天数')}
                          className="mt-1 h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600">工作日</div>
                        <div className="text-xl font-bold text-green-700">{diffResult.workdays}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(diffResult.workdays.toString(), '工作日')}
                          className="mt-1 h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-orange-600">周末</div>
                        <div className="text-xl font-bold text-orange-700">{diffResult.weekends}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(diffResult.weekends.toString(), '周末天数')}
                          className="mt-1 h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-600">节假日</div>
                        <div className="text-xl font-bold text-red-700">{diffResult.holidays}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(diffResult.holidays.toString(), '节假日')}
                          className="mt-1 h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">工作日加法</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base-date">基准日期</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="base-date"
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentDate(setBaseDate)}
                      >
                        今天
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="workdays">工作日天数</Label>
                    <Input
                      id="workdays"
                      type="number"
                      placeholder="例如: 30"
                      value={workdays}
                      onChange={(e) => setWorkdays(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button onClick={addWorkdays} className="w-full mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  计算结束日期
                </Button>

                {addResult && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">计算结果</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">结束日期</div>
                        <div className="text-lg font-mono font-semibold">{addResult}</div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(addResult, '结束日期')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkdayCalculator;