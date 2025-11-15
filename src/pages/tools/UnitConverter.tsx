import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ruler, Weight, Thermometer, Square, Droplets, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 单位转换配置
const unitCategories = {
  length: {
    name: '长度',
    icon: <Ruler className="w-4 h-4" />,
    baseUnit: 'meter',
    units: {
      millimeter: { name: '毫米', symbol: 'mm', factor: 0.001 },
      centimeter: { name: '厘米', symbol: 'cm', factor: 0.01 },
      meter: { name: '米', symbol: 'm', factor: 1 },
      kilometer: { name: '千米', symbol: 'km', factor: 1000 },
      inch: { name: '英寸', symbol: 'in', factor: 0.0254 },
      foot: { name: '英尺', symbol: 'ft', factor: 0.3048 },
      yard: { name: '码', symbol: 'yd', factor: 0.9144 },
      mile: { name: '英里', symbol: 'mi', factor: 1609.344 }
    }
  },
  weight: {
    name: '重量',
    icon: <Weight className="w-4 h-4" />,
    baseUnit: 'kilogram',
    units: {
      milligram: { name: '毫克', symbol: 'mg', factor: 0.000001 },
      gram: { name: '克', symbol: 'g', factor: 0.001 },
      kilogram: { name: '千克', symbol: 'kg', factor: 1 },
      ton: { name: '吨', symbol: 't', factor: 1000 },
      ounce: { name: '盎司', symbol: 'oz', factor: 0.0283495 },
      pound: { name: '磅', symbol: 'lb', factor: 0.453592 },
      stone: { name: '英石', symbol: 'st', factor: 6.35029 }
    }
  },
  temperature: {
    name: '温度',
    icon: <Thermometer className="w-4 h-4" />,
    baseUnit: 'celsius',
    units: {
      celsius: { name: '摄氏度', symbol: '°C' },
      fahrenheit: { name: '华氏度', symbol: '°F' },
      kelvin: { name: '开尔文', symbol: 'K' }
    }
  },
  area: {
    name: '面积',
    icon: <Square className="w-4 h-4" />,
    baseUnit: 'square_meter',
    units: {
      square_millimeter: { name: '平方毫米', symbol: 'mm²', factor: 0.000001 },
      square_centimeter: { name: '平方厘米', symbol: 'cm²', factor: 0.0001 },
      square_meter: { name: '平方米', symbol: 'm²', factor: 1 },
      square_kilometer: { name: '平方千米', symbol: 'km²', factor: 1000000 },
      hectare: { name: '公顷', symbol: 'ha', factor: 10000 },
      acre: { name: '英亩', symbol: 'ac', factor: 4046.86 },
      square_foot: { name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
      square_inch: { name: '平方英寸', symbol: 'in²', factor: 0.00064516 }
    }
  },
  volume: {
    name: '体积',
    icon: <Droplets className="w-4 h-4" />,
    baseUnit: 'liter',
    units: {
      milliliter: { name: '毫升', symbol: 'ml', factor: 0.001 },
      liter: { name: '升', symbol: 'L', factor: 1 },
      cubic_meter: { name: '立方米', symbol: 'm³', factor: 1000 },
      gallon_us: { name: '美制加仑', symbol: 'gal', factor: 3.78541 },
      gallon_uk: { name: '英制加仑', symbol: 'gal', factor: 4.54609 },
      fluid_ounce: { name: '液体盎司', symbol: 'fl oz', factor: 0.0295735 },
      cup: { name: '杯', symbol: 'cup', factor: 0.236588 },
      pint: { name: '品脱', symbol: 'pt', factor: 0.473176 }
    }
  }
};

// 温度转换函数
const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === toUnit) return value;
  
  // 先转换为摄氏度
  let celsius = value;
  if (fromUnit === 'fahrenheit') {
    celsius = (value - 32) * 5 / 9;
  } else if (fromUnit === 'kelvin') {
    celsius = value - 273.15;
  }
  
  // 再从摄氏度转换为目标单位
  if (toUnit === 'fahrenheit') {
    return celsius * 9 / 5 + 32;
  } else if (toUnit === 'kelvin') {
    return celsius + 273.15;
  }
  
  return celsius;
};

// 通用单位转换函数
const convertUnit = (value: number, fromUnit: string, toUnit: string, category: string): number => {
  if (fromUnit === toUnit) return value;
  
  const categoryData = unitCategories[category as keyof typeof unitCategories];
  
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }
  
  // 对于其他单位，使用因子转换
  const fromFactor = categoryData.units[fromUnit as keyof typeof categoryData.units]?.factor || 1;
  const toFactor = categoryData.units[toUnit as keyof typeof categoryData.units]?.factor || 1;
  
  return (value * fromFactor) / toFactor;
};

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const { toast } = useToast();
  
  // 当分类改变时，重置单位选择
  useEffect(() => {
    const categoryData = unitCategories[selectedCategory as keyof typeof unitCategories];
    const units = Object.keys(categoryData.units);
    setFromUnit(units[0] || '');
    setToUnit(units[1] || units[0] || '');
    setInputValue('');
    setOutputValue('');
  }, [selectedCategory]);
  
  // 当输入值或单位改变时，计算输出值
  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        try {
          const result = convertUnit(numValue, fromUnit, toUnit, selectedCategory);
          setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''));
        } catch (error) {
          setOutputValue('转换错误');
        }
      } else {
        setOutputValue('');
      }
    } else {
      setOutputValue('');
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory]);
  
  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setInputValue(outputValue);
  };
  
  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
  };
  
  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "复制成功",
        description: "结果已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };
  
  const currentCategory = unitCategories[selectedCategory as keyof typeof unitCategories];
  const units = Object.entries(currentCategory.units);
  
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Ruler className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">单位转换</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                支持长度、重量、温度、面积、体积等多种单位之间的精确转换
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="mb-4">转换工具</Badge>
        </div>
        
        {/* 分类选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              选择转换类型
            </CardTitle>
            <CardDescription>
              选择要转换的单位类型
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(unitCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto p-3"
                  onClick={() => setSelectedCategory(key)}
                >
                  {category.icon}
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 转换器主体 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentCategory.icon}
              {currentCategory.name}转换
            </CardTitle>
            <CardDescription>
              在下方输入数值并选择单位进行转换
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 输入区域 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 从单位 */}
              <div className="space-y-3">
                <Label htmlFor="from-value">从</Label>
                <div className="space-y-2">
                  <Input
                    id="from-value"
                    type="number"
                    placeholder="输入数值"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择单位" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* 交换按钮 */}
              <div className="flex items-center justify-center md:col-span-2 md:order-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapUnits}
                  className="rounded-full"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 到单位 */}
              <div className="space-y-3 md:order-2">
                <Label htmlFor="to-value">到</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="to-value"
                      type="text"
                      value={outputValue}
                      readOnly
                      className="text-lg bg-gray-50 dark:bg-gray-800"
                      placeholder="转换结果"
                    />
                    {outputValue && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                        onClick={() => handleCopy(outputValue)}
                      >
                        复制
                      </Button>
                    )}
                  </div>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择单位" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
              {outputValue && (
                <Button onClick={() => handleCopy(outputValue)}>
                  复制结果
                </Button>
              )}
            </div>
            
            {/* 转换公式显示 */}
            {inputValue && outputValue && outputValue !== '转换错误' && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">转换结果</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {inputValue} {currentCategory.units[fromUnit as keyof typeof currentCategory.units]?.symbol} = {outputValue} {currentCategory.units[toUnit as keyof typeof currentCategory.units]?.symbol}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* 常用转换表 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>常用{currentCategory.name}单位对照</CardTitle>
            <CardDescription>
              常见单位的换算关系
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {units.slice(0, 8).map(([key, unit]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">{unit.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{unit.symbol}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;