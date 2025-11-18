import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Calendar, Plus, Minus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DateCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [addValue, setAddValue] = useState('');
  const [addUnit, setAddUnit] = useState('days');
  const [diffResult, setDiffResult] = useState<{[key: string]: number} | null>(null);
  const [addResult, setAddResult] = useState('');
  const { toast } = useToast();

  const timeUnits = {
    'years': '年',
    'months': '月',
    'weeks': '周',
    'days': '天',
    'hours': '小时',
    'minutes': '分钟',
    'seconds': '秒'
  };

  const calculateDateDiff = () => {
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

      const diffMs = Math.abs(end.getTime() - start.getTime());
      
      const result = {
        years: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25)),
        months: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44)),
        weeks: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)),
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor(diffMs / (1000 * 60 * 60)),
        minutes: Math.floor(diffMs / (1000 * 60)),
        seconds: Math.floor(diffMs / 1000),
        milliseconds: diffMs
      };

      setDiffResult(result);
      
      toast({
        title: "计算成功",
        description: "日期差值已计算完成",
      });
    } catch (error: any) {
      toast({
        title: "计算失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateDateAdd = () => {
    if (!baseDate || !addValue) {
      toast({
        title: "输入不完整",
        description: "请输入基准日期和数值",
        variant: "destructive",
      });
      return;
    }

    try {
      const base = new Date(baseDate);
      const value = parseInt(addValue);

      if (isNaN(base.getTime()) || isNaN(value)) {
        throw new Error('无效的输入格式');
      }

      let result = new Date(base);

      switch (addUnit) {
        case 'years':
          result.setFullYear(result.getFullYear() + value);
          break;
        case 'months':
          result.setMonth(result.getMonth() + value);
          break;
        case 'weeks':
          result.setDate(result.getDate() + (value * 7));
          break;
        case 'days':
          result.setDate(result.getDate() + value);
          break;
        case 'hours':
          result.setHours(result.getHours() + value);
          break;
        case 'minutes':
          result.setMinutes(result.getMinutes() + value);
          break;
        case 'seconds':
          result.setSeconds(result.getSeconds() + value);
          break;
      }

      setAddResult(result.toISOString().slice(0, 19).replace('T', ' '));
      
      toast({
        title: "计算成功",
        description: "日期加减已计算完成",
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
    setter(now.toISOString().slice(0, 19).replace('T', ' '));
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              日期计算器
            </CardTitle>
            <CardDescription>
              计算日期差值和日期加减运算
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diff" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diff">日期差值</TabsTrigger>
                <TabsTrigger value="add">日期加减</TabsTrigger>
              </TabsList>

              <TabsContent value="diff" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">开始日期</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="start-date"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentDate(setStartDate)}
                      >
                        现在
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="end-date">结束日期</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="end-date"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentDate(setEndDate)}
                      >
                        现在
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateDateDiff} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  计算差值
                </Button>

                {diffResult && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">计算结果</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(diffResult).map(([unit, value]) => (
                        <div key={unit} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">{timeUnits[unit as keyof typeof timeUnits] || unit}</div>
                          <div className="text-lg font-mono font-semibold">{value.toLocaleString()}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(value.toString(), timeUnits[unit as keyof typeof timeUnits] || unit)}
                            className="mt-1 h-6 px-2"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                <div>
                  <Label htmlFor="base-date">基准日期</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="base-date"
                      type="datetime-local"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentDate(setBaseDate)}
                    >
                      现在
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-value">数值</Label>
                    <Input
                      id="add-value"
                      type="number"
                      placeholder="例如: 30 或 -7"
                      value={addValue}
                      onChange={(e) => setAddValue(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-unit">单位</Label>
                    <Select value={addUnit} onValueChange={setAddUnit}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(timeUnits).map(([unit, name]) => (
                          <SelectItem key={unit} value={unit}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateDateAdd} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  计算结果
                </Button>

                {addResult && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">计算结果</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">结果日期</div>
                        <div className="text-lg font-mono font-semibold">{addResult}</div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(addResult, '结果日期')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DateCalculator;