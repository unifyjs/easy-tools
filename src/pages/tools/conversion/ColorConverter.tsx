import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Copy, Palette, RefreshCw, Pipette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

const ColorConverter = () => {
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#FF5733',
    rgb: { r: 255, g: 87, b: 51 },
    hsl: { h: 11, s: 100, l: 60 },
    hsv: { h: 11, s: 80, v: 100 },
    cmyk: { c: 0, m: 66, y: 80, k: 0 }
  });
  const [inputType, setInputType] = useState<'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk'>('hex');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hue, setHue] = useState(11);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(60);
  const [customColor, setCustomColor] = useState('#FF5733');
  const { toast } = useToast();

  // 常用颜色
  const commonColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF',
    '#8000FF', '#FF00FF', '#FF0080', '#800000', '#804000', '#808000', '#408000', '#008000', '#008040',
    '#008080', '#004080', '#000080', '#400080', '#800080', '#800040', '#000000', '#404040', '#808080'
  ];

  // 同步颜色选择器状态
  useEffect(() => {
    const hsl = rgbToHsl(colorValues.rgb.r, colorValues.rgb.g, colorValues.rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setCustomColor(colorValues.hex);
  }, [colorValues]);

  // 颜色转换函数
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff) % 6; break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    v /= 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = g = b = 0;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const cmykToRgb = (c: number, m: number, y: number, k: number): { r: number; g: number; b: number } => {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b)
    };
  };

  // 从RGB更新所有颜色格式
  const updateAllFromRgb = (rgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({ hex, rgb, hsl, hsv, cmyk });
  };

  // 处理不同格式的输入
  const handleHexChange = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const rgb = hexToRgb(hex);
      if (rgb) {
        updateAllFromRgb(rgb);
      }
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      updateAllFromRgb({ r, g, b });
    }
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const rgb = hslToRgb(h, s, l);
      updateAllFromRgb(rgb);
    }
  };

  const handleHsvChange = (h: number, s: number, v: number) => {
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && v >= 0 && v <= 100) {
      const rgb = hsvToRgb(h, s, v);
      updateAllFromRgb(rgb);
    }
  };

  const handleCmykChange = (c: number, m: number, y: number, k: number) => {
    if (c >= 0 && c <= 100 && m >= 0 && m <= 100 && y >= 0 && y <= 100 && k >= 0 && k <= 100) {
      const rgb = cmykToRgb(c, m, y, k);
      updateAllFromRgb(rgb);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: `${format} 值已复制到剪贴板`,
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制颜色值",
        variant: "destructive",
      });
    }
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    updateAllFromRgb({ r, g, b });
  };

  return (
    <>
      <SEOHead toolId="color-converter" />
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold">颜色转换器</h1>
          </div>
          <p className="text-gray-600">
            支持 HEX、RGB、HSL、HSV、CMYK 等多种颜色格式之间的相互转换
          </p>
        </div>

        {/* 颜色预览 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>颜色预览</CardTitle>
            <CardDescription>当前选择的颜色效果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-lg border-2 border-gray-200 shadow-lg cursor-pointer hover:border-gray-300 transition-colors"
                  style={{ backgroundColor: colorValues.hex }}
                  onClick={() => setShowColorPicker(true)}
                />
                <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                  {/* <PopoverTrigger asChild>
                    <button className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white/30 hover:border-white/50 transition-colors overflow-hidden relative">
                      <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500"></div>
                      <Pipette className="absolute inset-0 w-4 h-4 m-auto text-white drop-shadow-lg" />
                    </button>
                  </PopoverTrigger> */}
                  <PopoverContent className="w-80 p-4 bg-slate-800 border-white/20" side="bottom" align="start">
                    <div className="space-y-4">
                      {/* 色相/饱和度选择区域 */}
                      <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-crosshair"
                           style={{
                             background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), linear-gradient(to top, black, transparent)`
                           }}
                           onClick={(e) => {
                             const rect = e.currentTarget.getBoundingClientRect();
                             const x = e.clientX - rect.left;
                             const y = e.clientY - rect.top;
                             const newSaturation = Math.round((x / rect.width) * 100);
                             const newLightness = Math.round(100 - (y / rect.height) * 100);
                             setSaturation(newSaturation);
                             setLightness(newLightness);
                             const newColor = `hsl(${hue}, ${newSaturation}%, ${newLightness}%)`;
                             setCustomColor(newColor);
                             // 转换为RGB并更新所有颜色值
                             const rgb = hslToRgb(hue, newSaturation, newLightness);
                             updateAllFromRgb(rgb);
                           }}>
                        <div className="absolute w-3 h-3 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                             style={{
                               left: `${saturation}%`,
                               top: `${100 - lightness}%`
                             }}></div>
                      </div>
                      {/* 色相条 */}
                      <div className="relative w-full h-4 rounded cursor-pointer"
                           style={{
                             background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                           }}
                           onClick={(e) => {
                             const rect = e.currentTarget.getBoundingClientRect();
                             const x = e.clientX - rect.left;
                             const newHue = Math.round((x / rect.width) * 360);
                             setHue(newHue);
                             const newColor = `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
                             setCustomColor(newColor);
                             // 转换为RGB并更新所有颜色值
                             const rgb = hslToRgb(newHue, saturation, lightness);
                             updateAllFromRgb(rgb);
                           }}>
                        <div className="absolute w-3 h-6 border-2 border-white rounded transform -translate-x-1/2 -translate-y-1/2 top-1/2"
                             style={{ left: `${(hue / 360) * 100}%` }}></div>
                      </div>
                      {/* 常用颜色 */}
                      <div className="grid grid-cols-9 gap-1">
                        {commonColors.map((color, index) => (
                          <button
                            key={index}
                            className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setCustomColor(color);
                              const rgb = hexToRgb(color);
                              if (rgb) {
                                updateAllFromRgb(rgb);
                                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                                setHue(hsl.h);
                                setSaturation(hsl.s);
                                setLightness(hsl.l);
                              }
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                      {/* 颜色输入框 */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={customColor}
                          onChange={(e) => {
                            setCustomColor(e.target.value);
                            if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                              const rgb = hexToRgb(e.target.value);
                              if (rgb) {
                                updateAllFromRgb(rgb);
                                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                                setHue(hsl.h);
                                setSaturation(hsl.s);
                                setLightness(hsl.l);
                              }
                            }
                          }}
                          className="flex-1 h-8 bg-white/10 border-white/20 text-white text-xs"
                          placeholder="#ffffff"
                        />
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          onClick={() => {
                            if (customColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                              const rgb = hexToRgb(customColor);
                              if (rgb) {
                                updateAllFromRgb(rgb);
                                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                                setHue(hsl.h);
                                setSaturation(hsl.s);
                                setLightness(hsl.l);
                              }
                            }
                            setShowColorPicker(false);
                          }}
                        >
                          确定
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">主色调</Label>
                    <div 
                      className="w-full h-8 rounded border"
                      style={{ backgroundColor: colorValues.hex }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">互补色</Label>
                    <div 
                      className="w-full h-8 rounded border"
                      style={{ 
                        backgroundColor: rgbToHex(
                          255 - colorValues.rgb.r,
                          255 - colorValues.rgb.g,
                          255 - colorValues.rgb.b
                        )
                      }}
                    />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={generateRandomColor}
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  随机颜色
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HEX 格式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HEX 十六进制
                <Badge variant="secondary">#RRGGBB</Badge>
              </CardTitle>
              <CardDescription>网页开发中最常用的颜色格式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hex-input">HEX 值</Label>
                <div className="flex gap-2">
                  <Input
                    id="hex-input"
                    value={colorValues.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#FF5733"
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(colorValues.hex, 'HEX')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RGB 格式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                RGB 红绿蓝
                <Badge variant="secondary">0-255</Badge>
              </CardTitle>
              <CardDescription>基于红、绿、蓝三原色的颜色模式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="rgb-r">R (红)</Label>
                  <Input
                    id="rgb-r"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.r}
                    onChange={(e) => handleRgbChange(
                      parseInt(e.target.value) || 0,
                      colorValues.rgb.g,
                      colorValues.rgb.b
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-g">G (绿)</Label>
                  <Input
                    id="rgb-g"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.g}
                    onChange={(e) => handleRgbChange(
                      colorValues.rgb.r,
                      parseInt(e.target.value) || 0,
                      colorValues.rgb.b
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-b">B (蓝)</Label>
                  <Input
                    id="rgb-b"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.b}
                    onChange={(e) => handleRgbChange(
                      colorValues.rgb.r,
                      colorValues.rgb.g,
                      parseInt(e.target.value) || 0
                    )}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(
                  `rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`,
                  'RGB'
                )}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制 RGB 值
              </Button>
            </CardContent>
          </Card>

          {/* HSL 格式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HSL 色相饱和度亮度
                <Badge variant="secondary">H:0-360, S/L:0-100%</Badge>
              </CardTitle>
              <CardDescription>更直观的颜色调整方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hsl-h">H (色相)</Label>
                  <Input
                    id="hsl-h"
                    type="number"
                    min="0"
                    max="360"
                    value={colorValues.hsl.h}
                    onChange={(e) => handleHslChange(
                      parseInt(e.target.value) || 0,
                      colorValues.hsl.s,
                      colorValues.hsl.l
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-s">S (饱和度)</Label>
                  <Input
                    id="hsl-s"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.s}
                    onChange={(e) => handleHslChange(
                      colorValues.hsl.h,
                      parseInt(e.target.value) || 0,
                      colorValues.hsl.l
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-l">L (亮度)</Label>
                  <Input
                    id="hsl-l"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.l}
                    onChange={(e) => handleHslChange(
                      colorValues.hsl.h,
                      colorValues.hsl.s,
                      parseInt(e.target.value) || 0
                    )}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(
                  `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`,
                  'HSL'
                )}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制 HSL 值
              </Button>
            </CardContent>
          </Card>

          {/* HSV 格式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HSV 色相饱和度明度
                <Badge variant="secondary">H:0-360, S/V:0-100%</Badge>
              </CardTitle>
              <CardDescription>设计软件中常用的颜色模式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hsv-h">H (色相)</Label>
                  <Input
                    id="hsv-h"
                    type="number"
                    min="0"
                    max="360"
                    value={colorValues.hsv.h}
                    onChange={(e) => handleHsvChange(
                      parseInt(e.target.value) || 0,
                      colorValues.hsv.s,
                      colorValues.hsv.v
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="hsv-s">S (饱和度)</Label>
                  <Input
                    id="hsv-s"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsv.s}
                    onChange={(e) => handleHsvChange(
                      colorValues.hsv.h,
                      parseInt(e.target.value) || 0,
                      colorValues.hsv.v
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="hsv-v">V (明度)</Label>
                  <Input
                    id="hsv-v"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsv.v}
                    onChange={(e) => handleHsvChange(
                      colorValues.hsv.h,
                      colorValues.hsv.s,
                      parseInt(e.target.value) || 0
                    )}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(
                  `hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`,
                  'HSV'
                )}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制 HSV 值
              </Button>
            </CardContent>
          </Card>

          {/* CMYK 格式 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CMYK 印刷四色
                <Badge variant="secondary">0-100%</Badge>
              </CardTitle>
              <CardDescription>印刷行业使用的颜色模式（青、品红、黄、黑）</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label htmlFor="cmyk-c">C (青)</Label>
                  <Input
                    id="cmyk-c"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.c}
                    onChange={(e) => handleCmykChange(
                      parseInt(e.target.value) || 0,
                      colorValues.cmyk.m,
                      colorValues.cmyk.y,
                      colorValues.cmyk.k
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-m">M (品红)</Label>
                  <Input
                    id="cmyk-m"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.m}
                    onChange={(e) => handleCmykChange(
                      colorValues.cmyk.c,
                      parseInt(e.target.value) || 0,
                      colorValues.cmyk.y,
                      colorValues.cmyk.k
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-y">Y (黄)</Label>
                  <Input
                    id="cmyk-y"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.y}
                    onChange={(e) => handleCmykChange(
                      colorValues.cmyk.c,
                      colorValues.cmyk.m,
                      parseInt(e.target.value) || 0,
                      colorValues.cmyk.k
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="cmyk-k">K (黑)</Label>
                  <Input
                    id="cmyk-k"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.cmyk.k}
                    onChange={(e) => handleCmykChange(
                      colorValues.cmyk.c,
                      colorValues.cmyk.m,
                      colorValues.cmyk.y,
                      parseInt(e.target.value) || 0
                    )}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(
                  `cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`,
                  'CMYK'
                )}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制 CMYK 值
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 颜色格式说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>颜色格式说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">HEX (十六进制)</h4>
                <p className="text-sm text-gray-600">
                  网页开发中最常用的颜色格式，以 # 开头，后跟 6 位十六进制数字。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">RGB (红绿蓝)</h4>
                <p className="text-sm text-gray-600">
                  基于光的三原色模式，每个分量的取值范围是 0-255。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">HSL (色相饱和度亮度)</h4>
                <p className="text-sm text-gray-600">
                  更直观的颜色表示方法，便于调整颜色的各个属性。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">HSV (色相饱和度明度)</h4>
                <p className="text-sm text-gray-600">
                  设计软件中常用的颜色模式，与 HSL 类似但计算方式不同。
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <h4 className="font-semibold">CMYK (印刷四色)</h4>
                <p className="text-sm text-gray-600">
                  印刷行业使用的减色模式，基于青色(C)、品红色(M)、黄色(Y)和黑色(K)四种油墨。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default ColorConverter;