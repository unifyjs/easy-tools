import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, RotateCcw, QrCode, Smartphone, Wifi, Mail, Phone } from 'lucide-react';
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

const QrGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrOptions, setQrOptions] = useState<QROptions>({
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  });
  const [activeTab, setActiveTab] = useState('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const generateQRCode = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要生成二维码的内容",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(text, qrOptions);
      setQrDataUrl(dataUrl);
      
      toast({
        title: "生成成功",
        description: "二维码已生成",
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: "请检查输入内容是否正确",
        variant: "destructive",
      });
    }
  };

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
    link.download = `qrcode.${qrOptions.type.split('/')[1]}`;
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
                    生成二维码
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
                <CardTitle>样式设置</CardTitle>
                <CardDescription>自定义二维码的外观</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        alt="Generated QR Code" 
                        className="max-w-full h-auto"
                        style={{ width: qrOptions.width, height: qrOptions.width }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400"
                      style={{ width: qrOptions.width, height: qrOptions.width }}
                    >
                      <QrCode className="w-16 h-16 mb-4" />
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