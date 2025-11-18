import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, Copy, RotateCcw, QrCode, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsQR from 'jsqr';

interface DecodeResult {
  data: string;
  format: string;
  errorCorrectionLevel: string;
  version: number;
  mask: number;
  location: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
  };
}

const QrDecoder = () => {
  const [decodedResult, setDecodedResult] = useState<DecodeResult | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择有效的图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;
      setPreviewImage(imageSrc);
      decodeFromImage(imageSrc);
    };
    reader.readAsDataURL(file);
  }, []);

  // 从图片解码二维码
  const decodeFromImage = useCallback((imageSrc: string) => {
    setIsDecoding(true);
    setError('');
    setDecodedResult(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setError('无法创建画布上下文');
        setIsDecoding(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const result: DecodeResult = {
          data: code.data,
          format: 'QR Code',
          errorCorrectionLevel: code.errorCorrectionLevel || 'Unknown',
          version: code.version || 0,
          mask: code.mask || 0,
          location: code.location
        };
        setDecodedResult(result);
        toast({
          title: "解码成功",
          description: "二维码已成功解码",
        });
      } else {
        setError('未检测到二维码，请确保图片清晰且包含有效的二维码');
      }
      setIsDecoding(false);
    };

    img.onerror = () => {
      setError('图片加载失败');
      setIsDecoding(false);
    };

    img.src = imageSrc;
  }, [toast]);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // 优先使用后置摄像头
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError('');
      }
    } catch (err) {
      setError('无法访问摄像头，请检查权限设置');
      console.error('Camera access error:', err);
    }
  }, []);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // 从摄像头捕获并解码
  const captureFromCamera = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      const result: DecodeResult = {
        data: code.data,
        format: 'QR Code',
        errorCorrectionLevel: code.errorCorrectionLevel || 'Unknown',
        version: code.version || 0,
        mask: code.mask || 0,
        location: code.location
      };
      setDecodedResult(result);
      stopCamera();
      toast({
        title: "解码成功",
        description: "二维码已成功解码",
      });
    } else {
      setError('未检测到二维码，请调整摄像头角度或距离');
    }
  }, [stopCamera, toast]);

  // 复制结果到剪贴板
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  }, [toast]);

  // 重置所有状态
  const resetAll = useCallback(() => {
    setDecodedResult(null);
    setError('');
    setPreviewImage('');
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [stopCamera]);

  // 检测URL类型
  const detectUrlType = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return 'URL链接';
    } else if (url.startsWith('mailto:')) {
      return '邮箱地址';
    } else if (url.startsWith('tel:')) {
      return '电话号码';
    } else if (url.startsWith('wifi:')) {
      return 'WiFi配置';
    } else if (url.startsWith('geo:')) {
      return '地理位置';
    } else if (url.includes('@') && url.includes('.')) {
      return '邮箱地址';
    } else if (/^\+?[\d\s\-\(\)]+$/.test(url)) {
      return '电话号码';
    }
    return '文本内容';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <QrCode className="h-8 w-8 text-primary" />
          二维码解码器
        </h1>
        <p className="text-muted-foreground">
          支持图片上传和摄像头扫描，快速解码二维码内容
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            图片上传
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            摄像头扫描
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                上传二维码图片
              </CardTitle>
              <CardDescription>
                支持 PNG、JPG、JPEG、GIF、BMP、WEBP 等格式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">点击上传</span> 或拖拽文件到此处
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      支持常见图片格式 (最大 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </label>
              </div>

              {previewImage && (
                <div className="mt-4">
                  <Label>预览图片</Label>
                  <div className="mt-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                摄像头扫描
              </CardTitle>
              <CardDescription>
                使用设备摄像头实时扫描二维码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {!isCameraActive ? (
                  <Button onClick={startCamera} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    启动摄像头
                  </Button>
                ) : (
                  <>
                    <Button onClick={captureFromCamera} className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      扫描二维码
                    </Button>
                    <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                      停止摄像头
                    </Button>
                  </>
                )}
              </div>

              {isCameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-lg border"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 加载状态 */}
      {isDecoding && (
        <Alert>
          <QrCode className="h-4 w-4 animate-spin" />
          <AlertDescription>正在解码二维码...</AlertDescription>
        </Alert>
      )}

      {/* 解码结果 */}
      {decodedResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              解码结果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>内容类型</Label>
              <Badge variant="secondary">
                {detectUrlType(decodedResult.data)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>解码内容</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(decodedResult.data)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  复制
                </Button>
              </div>
              <Textarea
                value={decodedResult.data}
                readOnly
                className="min-h-[100px] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">格式</Label>
                <p className="font-mono">{decodedResult.format}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">版本</Label>
                <p className="font-mono">{decodedResult.version}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">容错级别</Label>
                <p className="font-mono">{decodedResult.errorCorrectionLevel}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">掩码</Label>
                <p className="font-mono">{decodedResult.mask}</p>
              </div>
            </div>

            {/* 如果是URL，提供打开链接的选项 */}
            {(decodedResult.data.startsWith('http://') || decodedResult.data.startsWith('https://')) && (
              <div className="pt-2">
                <Button
                  onClick={() => window.open(decodedResult.data, '_blank')}
                  className="flex items-center gap-2"
                >
                  打开链接
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={resetAll}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          重置
        </Button>
      </div>
    </div>
  );
};

export default QrDecoder;