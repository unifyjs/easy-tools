import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Download, Copy, RotateCcw, QrCode, Smartphone, Wifi, Mail, Phone, Upload, Palette, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
}

interface LogoOptions {
  enabled: boolean;
  file: File | null;
  size: number;
  borderRadius: number;
  opacity: number;
}

interface StyleOptions {
  dotStyle: 'square' | 'circle' | 'rounded';
  gradient: boolean;
  gradientDirection: number;
  borderRadius: number;
  shadow: boolean;
  theme: string;
}

const QrGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrOptions, setQrOptions] = useState<QROptions>({
    errorCorrectionLevel: 'H', // 提高容错级别以支持logo
    type: 'image/png',
    quality: 0.92,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  });
  const [logoOptions, setLogoOptions] = useState<LogoOptions>({
    enabled: false,
    file: null,
    size: 20,
    borderRadius: 8,
    opacity: 100
  });
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    dotStyle: 'square',
    gradient: false,
    gradientDirection: 45,
    borderRadius: 0,
    shadow: false,
    theme: 'default'
  });
  const [activeTab, setActiveTab] = useState('text');
  const [activeStyleTab, setActiveStyleTab] = useState('basic');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // WiFi 配置
  const [wifiConfig, setWifiConfig] = useState({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  });

  // 联系人配置
  const [contactConfig, setContactConfig] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });

  // 预设主题
  const themes = {
    default: { dark: '#000000', light: '#FFFFFF' },
    blue: { dark: '#1e40af', light: '#dbeafe' },
    green: { dark: '#059669', light: '#d1fae5' },
    purple: { dark: '#7c3aed', light: '#e9d5ff' },
    red: { dark: '#dc2626', light: '#fee2e2' },
    orange: { dark: '#ea580c', light: '#fed7aa' },
    pink: { dark: '#db2777', light: '#fce7f3' },
    gradient: { dark: '#6366f1', light: '#f0f9ff' }
  };

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes];
    if (theme) {
      setQrOptions(prev => ({
        ...prev,
        color: theme
      }));
      setStyleOptions(prev => ({
        ...prev,
        theme: themeName,
        gradient: themeName === 'gradient'
      }));
    }
  };

  const generateEnhancedQRCode = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要生成二维码的内容",
        variant: "destructive",
      });
      return;
    }

    try {
      // 首先生成基础二维码
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法创建canvas上下文');

      // 生成二维码到canvas
      await QRCode.toCanvas(canvas, text, {
        ...qrOptions,
        errorCorrectionLevel: logoOptions.enabled ? 'H' : qrOptions.errorCorrectionLevel
      });

      // 应用美化效果
      await applyEnhancements(canvas, ctx);

      // 添加logo
      if (logoOptions.enabled && logoOptions.file) {
        await addLogoToCanvas(canvas, ctx);
      }

      const dataUrl = canvas.toDataURL(qrOptions.type, qrOptions.quality);
      setQrDataUrl(dataUrl);
      
      toast({
        title: "生成成功",
        description: "二维码已生成",
      });
    } catch (error) {
      console.error('生成二维码失败:', error);
      toast({
        title: "生成失败",
        description: "请检查输入内容和设置是否正确",
        variant: "destructive",
      });
    }
  };

  const applyEnhancements = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // 应用圆角效果
    if (styleOptions.borderRadius > 0) {
      applyBorderRadius(canvas, ctx, styleOptions.borderRadius);
    }

    // 应用渐变效果
    if (styleOptions.gradient) {
      applyGradient(canvas, ctx);
    }

    // 应用点样式
    if (styleOptions.dotStyle !== 'square') {
      applyDotStyle(canvas, ctx);
    }

    // 应用阴影效果
    if (styleOptions.shadow) {
      applyShadow(canvas, ctx);
    }
  };

  const applyBorderRadius = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, radius: number) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
    ctx.clip();
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const applyGradient = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
        // 这是一个黑色像素，应用渐变色
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        const progress = (x + y) / (canvas.width + canvas.height);
        
        // 简化的渐变计算
        const r = Math.floor(99 + progress * (102 - 99));
        const g = Math.floor(102 + progress * (241 - 102));
        const b = Math.floor(241 + progress * (241 - 241));
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const applyDotStyle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const moduleSize = canvas.width / 25; // 假设25x25模块
    
    ctx.fillStyle = qrOptions.color.light;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = qrOptions.color.dark;
    
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const pixelX = Math.floor(x * moduleSize + moduleSize / 2);
        const pixelY = Math.floor(y * moduleSize + moduleSize / 2);
        const pixelIndex = (pixelY * canvas.width + pixelX) * 4;
        
        if (data[pixelIndex] === 0) { // 黑色模块
          const centerX = x * moduleSize + moduleSize / 2;
          const centerY = y * moduleSize + moduleSize / 2;
          
          if (styleOptions.dotStyle === 'circle') {
            ctx.beginPath();
            ctx.arc(centerX, centerY, moduleSize * 0.4, 0, 2 * Math.PI);
            ctx.fill();
          } else if (styleOptions.dotStyle === 'rounded') {
            const size = moduleSize * 0.8;
            ctx.beginPath();
            ctx.roundRect(
              centerX - size / 2, 
              centerY - size / 2, 
              size, 
              size, 
              moduleSize * 0.2
            );
            ctx.fill();
          }
        }
      }
    }
  };

  const applyShadow = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvas.width + 20;
    tempCanvas.height = canvas.height + 20;
    
    tempCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    tempCtx.shadowBlur = 10;
    tempCtx.shadowOffsetX = 5;
    tempCtx.shadowOffsetY = 5;
    
    tempCtx.drawImage(canvas, 10, 10);
    
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const addLogoToCanvas = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (!logoOptions.file) return;

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const logoSize = (canvas.width * logoOptions.size) / 100;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        
        // 保存当前状态
        ctx.save();
        
        // 设置透明度
        ctx.globalAlpha = logoOptions.opacity / 100;
        
        // 创建圆角遮罩
        if (logoOptions.borderRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(x, y, logoSize, logoSize, logoOptions.borderRadius);
          ctx.clip();
        }
        
        // 绘制logo
        ctx.drawImage(img, x, y, logoSize, logoSize);
        
        // 恢复状态
        ctx.restore();
        resolve();
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(logoOptions.file);
    });
  };

  const generateQRCode = generateEnhancedQRCode;

  const handleGenerate = () => {
    let text = '';
    
    switch (activeTab) {
      case 'text':
        text = inputText;
        break;
      case 'url':
        text = inputText.startsWith('http') ? inputText : `https://${inputText}`;
        break;
      case 'wifi':
        text = `WIFI:T:${wifiConfig.security};S:${wifiConfig.ssid};P:${wifiConfig.password};H:${wifiConfig.hidden ? 'true' : 'false'};;`;
        break;
      case 'contact':
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactConfig.name}
TEL:${contactConfig.phone}
EMAIL:${contactConfig.email}
ORG:${contactConfig.organization}
URL:${contactConfig.url}
END:VCARD`;
        text = vcard;
        break;
      case 'email':
        text = `mailto:${inputText}`;
        break;
      case 'phone':
        text = `tel:${inputText}`;
        break;
      default:
        text = inputText;
    }
    
    generateQRCode(text);
  };

  const handleDownload = () => {
    if (!qrDataUrl) {
      toast({
        title: "无内容可下载",
        description: "请先生成二维码",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `enhanced-qrcode.${qrOptions.type.split('/')[1]}`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "下载成功",
      description: "二维码图片已保存",
    });
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) {
      toast({
        title: "无内容可复制",
        description: "请先生成二维码",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      
      toast({
        title: "复制成功",
        description: "二维码图片已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "您的浏览器可能不支持图片复制功能",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText('');
    setQrDataUrl('');
    setWifiConfig({ ssid: '', password: '', security: 'WPA', hidden: false });
    setContactConfig({ name: '', phone: '', email: '', organization: '', url: '' });
    setLogoOptions(prev => ({ ...prev, file: null, enabled: false }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        toast({
          title: "文件过大",
          description: "请选择小于5MB的图片文件",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "文件格式错误",
          description: "请选择图片文件",
          variant: "destructive",
        });
        return;
      }
      
      setLogoOptions(prev => ({ ...prev, file, enabled: true }));
      toast({
        title: "Logo上传成功",
        description: "请重新生成二维码以应用Logo",
      });
    }
  }, [toast]);

  const removeLogo = () => {
    setLogoOptions(prev => ({ ...prev, file: null, enabled: false }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const presetTemplates = [
    { name: '个人网站', value: 'https://example.com' },
    { name: '微信号', value: 'weixin://dl/chat?{username}' },
    { name: '支付宝', value: 'https://qr.alipay.com/{code}' },
    { name: '位置信息', value: 'geo:39.9042,116.4074' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            二维码生成器
          </h1>
          <p className="text-gray-600 mt-2">支持Logo嵌入和多种美化效果的专业二维码生成工具</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：输入和配置 */}
          <div className="space-y-6">
            {/* 内容类型选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  二维码内容
                </CardTitle>
                <CardDescription>选择要生成的二维码类型</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="text">文本</TabsTrigger>
                    <TabsTrigger value="url">网址</TabsTrigger>
                    <TabsTrigger value="wifi">WiFi</TabsTrigger>
                    <TabsTrigger value="contact">联系人</TabsTrigger>
                    <TabsTrigger value="email">邮箱</TabsTrigger>
                    <TabsTrigger value="phone">电话</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">文本内容</Label>
                      <Textarea
                        id="text-input"
                        placeholder="输入要生成二维码的文本内容..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="url-input">网址</Label>
                      <Input
                        id="url-input"
                        placeholder="example.com 或 https://example.com"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Label className="text-sm text-gray-600">快速模板：</Label>
                      {presetTemplates.map((template, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setInputText(template.value)}
                        >
                          {template.name}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wifi-ssid">网络名称 (SSID)</Label>
                        <Input
                          id="wifi-ssid"
                          placeholder="WiFi名称"
                          value={wifiConfig.ssid}
                          onChange={(e) => setWifiConfig({...wifiConfig, ssid: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-security">加密方式</Label>
                        <Select value={wifiConfig.security} onValueChange={(value) => setWifiConfig({...wifiConfig, security: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">无密码</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="wifi-password">密码</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="WiFi密码"
                        value={wifiConfig.password}
                        onChange={(e) => setWifiConfig({...wifiConfig, password: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">姓名</Label>
                        <Input
                          id="contact-name"
                          placeholder="联系人姓名"
                          value={contactConfig.name}
                          onChange={(e) => setContactConfig({...contactConfig, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">电话</Label>
                        <Input
                          id="contact-phone"
                          placeholder="手机号码"
                          value={contactConfig.phone}
                          onChange={(e) => setContactConfig({...contactConfig, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-email">邮箱</Label>
                      <Input
                        id="contact-email"
                        placeholder="email@example.com"
                        value={contactConfig.email}
                        onChange={(e) => setContactConfig({...contactConfig, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-org">公司/组织</Label>
                      <Input
                        id="contact-org"
                        placeholder="公司或组织名称"
                        value={contactConfig.organization}
                        onChange={(e) => setContactConfig({...contactConfig, organization: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label htmlFor="email-input">邮箱地址</Label>
                      <Input
                        id="email-input"
                        placeholder="example@email.com"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label htmlFor="phone-input">电话号码</Label>
                      <Input
                        id="phone-input"
                        placeholder="+86 138 0013 8000"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleGenerate} className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成增强二维码
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 样式配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  样式设置
                </CardTitle>
                <CardDescription>自定义二维码的外观和美化效果</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeStyleTab} onValueChange={setActiveStyleTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">基础设置</TabsTrigger>
                    <TabsTrigger value="logo">Logo设置</TabsTrigger>
                    <TabsTrigger value="beauty">美化效果</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="size">尺寸: {qrOptions.width}px</Label>
                        <Slider
                          id="size"
                          min={128}
                          max={512}
                          step={32}
                          value={[qrOptions.width]}
                          onValueChange={(value) => setQrOptions({...qrOptions, width: value[0]})}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="margin">边距: {qrOptions.margin}</Label>
                        <Slider
                          id="margin"
                          min={0}
                          max={10}
                          step={1}
                          value={[qrOptions.margin]}
                          onValueChange={(value) => setQrOptions({...qrOptions, margin: value[0]})}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dark-color">前景色</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="dark-color"
                            type="color"
                            value={qrOptions.color.dark}
                            onChange={(e) => setQrOptions({
                              ...qrOptions,
                              color: {...qrOptions.color, dark: e.target.value}
                            })}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={qrOptions.color.dark}
                            onChange={(e) => setQrOptions({
                              ...qrOptions,
                              color: {...qrOptions.color, dark: e.target.value}
                            })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="light-color">背景色</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="light-color"
                            type="color"
                            value={qrOptions.color.light}
                            onChange={(e) => setQrOptions({
                              ...qrOptions,
                              color: {...qrOptions.color, light: e.target.value}
                            })}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={qrOptions.color.light}
                            onChange={(e) => setQrOptions({
                              ...qrOptions,
                              color: {...qrOptions.color, light: e.target.value}
                            })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="error-level">容错级别</Label>
                        <Select 
                          value={qrOptions.errorCorrectionLevel} 
                          onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                            setQrOptions({...qrOptions, errorCorrectionLevel: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L">低 (7%)</SelectItem>
                            <SelectItem value="M">中 (15%)</SelectItem>
                            <SelectItem value="Q">较高 (25%)</SelectItem>
                            <SelectItem value="H">高 (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="format">输出格式</Label>
                        <Select 
                          value={qrOptions.type} 
                          onValueChange={(value: 'image/png' | 'image/jpeg' | 'image/webp') => 
                            setQrOptions({...qrOptions, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image/png">PNG</SelectItem>
                            <SelectItem value="image/jpeg">JPEG</SelectItem>
                            <SelectItem value="image/webp">WebP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="logo" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>启用Logo</Label>
                        <Switch
                          checked={logoOptions.enabled}
                          onCheckedChange={(checked) => 
                            setLogoOptions(prev => ({ ...prev, enabled: checked }))
                          }
                        />
                      </div>

                      {logoOptions.enabled && (
                        <>
                          <div>
                            <Label>上传Logo</Label>
                            <div className="mt-2 space-y-2">
                              <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => logoInputRef.current?.click()}
                                  className="flex-1"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  选择图片
                                </Button>
                                {logoOptions.file && (
                                  <Button
                                    variant="outline"
                                    onClick={removeLogo}
                                  >
                                    移除
                                  </Button>
                                )}
                              </div>
                              {logoOptions.file && (
                                <p className="text-sm text-gray-600">
                                  已选择: {logoOptions.file.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label>Logo大小: {logoOptions.size}%</Label>
                            <Slider
                              min={10}
                              max={40}
                              step={2}
                              value={[logoOptions.size]}
                              onValueChange={(value) => 
                                setLogoOptions(prev => ({ ...prev, size: value[0] }))
                              }
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label>Logo圆角: {logoOptions.borderRadius}px</Label>
                            <Slider
                              min={0}
                              max={20}
                              step={1}
                              value={[logoOptions.borderRadius]}
                              onValueChange={(value) => 
                                setLogoOptions(prev => ({ ...prev, borderRadius: value[0] }))
                              }
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label>Logo透明度: {logoOptions.opacity}%</Label>
                            <Slider
                              min={50}
                              max={100}
                              step={5}
                              value={[logoOptions.opacity]}
                              onValueChange={(value) => 
                                setLogoOptions(prev => ({ ...prev, opacity: value[0] }))
                              }
                              className="mt-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="beauty" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>预设主题</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {Object.entries(themes).map(([key, theme]) => (
                            <Button
                              key={key}
                              variant={styleOptions.theme === key ? "default" : "outline"}
                              size="sm"
                              onClick={() => applyTheme(key)}
                              className="h-12 flex flex-col items-center justify-center"
                            >
                              <div 
                                className="w-4 h-4 rounded mb-1"
                                style={{ backgroundColor: theme.dark }}
                              />
                              <span className="text-xs capitalize">{key}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>点样式</Label>
                        <Select 
                          value={styleOptions.dotStyle} 
                          onValueChange={(value: 'square' | 'circle' | 'rounded') => 
                            setStyleOptions(prev => ({ ...prev, dotStyle: value }))
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">方形</SelectItem>
                            <SelectItem value="circle">圆形</SelectItem>
                            <SelectItem value="rounded">圆角方形</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>渐变效果</Label>
                        <Switch
                          checked={styleOptions.gradient}
                          onCheckedChange={(checked) => 
                            setStyleOptions(prev => ({ ...prev, gradient: checked }))
                          }
                        />
                      </div>

                      {styleOptions.gradient && (
                        <div>
                          <Label>渐变方向: {styleOptions.gradientDirection}°</Label>
                          <Slider
                            min={0}
                            max={360}
                            step={15}
                            value={[styleOptions.gradientDirection]}
                            onValueChange={(value) => 
                              setStyleOptions(prev => ({ ...prev, gradientDirection: value[0] }))
                            }
                            className="mt-2"
                          />
                        </div>
                      )}

                      <div>
                        <Label>整体圆角: {styleOptions.borderRadius}px</Label>
                        <Slider
                          min={0}
                          max={30}
                          step={2}
                          value={[styleOptions.borderRadius]}
                          onValueChange={(value) => 
                            setStyleOptions(prev => ({ ...prev, borderRadius: value[0] }))
                          }
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>阴影效果</Label>
                        <Switch
                          checked={styleOptions.shadow}
                          onCheckedChange={(checked) => 
                            setStyleOptions(prev => ({ ...prev, shadow: checked }))
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：预览和下载 */}
          <div className="space-y-6">
            {/* 二维码预览 */}
            <Card>
              <CardHeader>
                <CardTitle>二维码预览</CardTitle>
                <CardDescription>生成的二维码将显示在这里</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  {qrDataUrl ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                      <img 
                        src={qrDataUrl} 
                        alt="Generated Enhanced QR Code" 
                        className="max-w-full h-auto"
                        style={{ maxWidth: qrOptions.width + 40, maxHeight: qrOptions.width + 40 }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400"
                      style={{ width: qrOptions.width, height: qrOptions.width }}
                    >
                      <Sparkles className="w-16 h-16 mb-4" />
                      <p>二维码将显示在这里</p>
                    </div>
                  )}

                  {qrDataUrl && (
                    <div className="flex gap-2 w-full">
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        下载图片
                      </Button>
                      <Button variant="outline" onClick={handleCopyImage} className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        复制图片
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">扫码方式</p>
                      <p>使用手机相机或二维码扫描应用扫描生成的二维码</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 text-purple-500" />
                    <div>
                      <p className="font-medium">Logo功能</p>
                      <p>添加Logo时建议使用高容错级别，Logo大小不超过30%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Palette className="w-4 h-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">美化效果</p>
                      <p>可应用渐变、圆角、阴影等效果，让二维码更美观</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wifi className="w-4 h-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">WiFi二维码</p>
                      <p>扫描后可直接连接到指定的WiFi网络</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 text-purple-500" />
                    <div>
                      <p className="font-medium">联系人二维码</p>
                      <p>扫描后可直接添加联系人信息到通讯录</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 text-orange-500" />
                    <div>
                      <p className="font-medium">容错级别</p>
                      <p>级别越高，二维码越复杂，但损坏后仍可正常扫描</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;