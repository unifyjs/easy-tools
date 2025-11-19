import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, RotateCcw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState('');
  const [customName, setCustomName] = useState('');
  const [countdowns, setCountdowns] = useState<{
    id: string;
    name: string;
    target: Date;
    isActive: boolean;
  }[]>([]);
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }}>({});
  const { toast } = useToast();

  // 预设的重要日期
  const presetDates = [
    { name: '2025年春节', date: '2025-01-29T00:00:00' },
    { name: '2025年元旦', date: '2025-01-01T00:00:00' },
    { name: '2024年圣诞节', date: '2024-12-25T00:00:00' },
    { name: '2025年情人节', date: '2025-02-14T00:00:00' },
    { name: '2025年劳动节', date: '2025-05-01T00:00:00' },
    { name: '2025年国庆节', date: '2025-10-01T00:00:00' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const newTimeLeft: typeof timeLeft = {};

      countdowns.forEach(countdown => {
        if (countdown.isActive) {
          const distance = countdown.target.getTime() - now;
          
          if (distance > 0) {
            newTimeLeft[countdown.id] = {
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000),
              isExpired: false
            };
          } else {
            newTimeLeft[countdown.id] = {
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              isExpired: true
            };
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdowns]);

  const addCountdown = (name: string, date: string) => {
    if (!date) {
      toast({
        title: "输入不完整",
        description: "请选择目标日期",
        variant: "destructive",
      });
      return;
    }

    try {
      const target = new Date(date);
      if (isNaN(target.getTime())) {
        throw new Error('无效的日期格式');
      }

      const id = Date.now().toString();
      const newCountdown = {
        id,
        name: name || '倒计时',
        target,
        isActive: true
      };

      setCountdowns(prev => [...prev, newCountdown]);
      setCustomName('');
      setTargetDate('');
      
      toast({
        title: "添加成功",
        description: `倒计时"${newCountdown.name}"已添加`,
      });
    } catch (error: any) {
      toast({
        title: "添加失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleCountdown = (id: string) => {
    setCountdowns(prev => 
      prev.map(countdown => 
        countdown.id === id 
          ? { ...countdown, isActive: !countdown.isActive }
          : countdown
      )
    );
  };

  const removeCountdown = (id: string) => {
    setCountdowns(prev => prev.filter(countdown => countdown.id !== id));
    setTimeLeft(prev => {
      const newTimeLeft = { ...prev };
      delete newTimeLeft[id];
      return newTimeLeft;
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

  const formatTimeString = (time: typeof timeLeft[string]) => {
    if (time.isExpired) return '已到期';
    return `${time.days}天 ${time.hours}时 ${time.minutes}分 ${time.seconds}秒`;
  };

  return (   
  <>
      <SEOHead toolId="countdown-timer" />
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              倒计时器
            </CardTitle>
            <CardDescription>
              创建多个倒计时，追踪重要日期和事件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="custom-name">倒计时名称</Label>
                  <Input
                    id="custom-name"
                    placeholder="例如: 生日、考试、旅行"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="target-date">目标日期</Label>
                  <Input
                    id="target-date"
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button 
                onClick={() => addCountdown(customName, targetDate)} 
                className="w-full"
              >
                <Timer className="w-4 h-4 mr-2" />
                添加倒计时
              </Button>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">快速添加</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {presetDates.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addCountdown(preset.name, preset.date)}
                      className="text-xs"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {countdowns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>活动倒计时</CardTitle>
              <CardDescription>正在进行的倒计时列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countdowns.map(countdown => {
                  const time = timeLeft[countdown.id];
                  return (
                    <div key={countdown.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{countdown.name}</h3>
                          <Badge variant={countdown.isActive ? "default" : "secondary"}>
                            {countdown.isActive ? "运行中" : "已暂停"}
                          </Badge>
                          {time?.isExpired && (
                            <Badge variant="destructive">已到期</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCountdown(countdown.id)}
                          >
                            {countdown.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCountdown(countdown.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        目标时间: {countdown.target.toLocaleString('zh-CN')}
                      </div>

                      {time && countdown.isActive && (
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{time.days}</div>
                            <div className="text-sm text-blue-500">天</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{time.hours}</div>
                            <div className="text-sm text-green-500">时</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{time.minutes}</div>
                            <div className="text-sm text-orange-500">分</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{time.seconds}</div>
                            <div className="text-sm text-red-500">秒</div>
                          </div>
                        </div>
                      )}

                      {time && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-mono text-sm">
                            {formatTimeString(time)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(formatTimeString(time), '倒计时')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default CountdownTimer;