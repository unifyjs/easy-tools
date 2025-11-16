import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Upload, Download, Image as ImageIcon, X, Link, Unlink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResizedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
}

const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage'>('pixels');
  const [percentage, setPercentage] = useState<string>('100');
  const [resizedImage, setResizedImage] = useState<ResizedImage | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presetSizes = [
    { name: '微信头像', width: 120, height: 120 },
    { name: '微博头像', width: 180, height: 180 },
    { name: 'Instagram 正方形', width: 1080, height: 1080 },
    { name: 'Facebook 封面', width: 820, height: 312 },
    { name: 'Twitter 头像', width: 400, height: 400 },
    { name: 'YouTube 缩略图', width: 1280, height: 720 },
    { name: '网站标志', width: 256, height: 256 },
    { name: 'A4 纸张 (300DPI)', width: 2480, height: 3508 },
  ];

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: '文件格式错误',
        description: '请选择有效的图片文件',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResizedImage(null);

    // 获取原始尺寸
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetWidth(img.width.toString());
      setTargetHeight(img.height.toString());
    };
    img.src = url;
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleWidthChange = (value: string) => {
    setTargetWidth(value);
    if (maintainAspectRatio && originalDimensions && value) {
      const newWidth = parseInt(value);
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(newWidth * aspectRatio);
      setTargetHeight(newHeight.toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setTargetHeight(value);
    if (maintainAspectRatio && originalDimensions && value) {
      const newHeight = parseInt(value);
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      setTargetWidth(newWidth.toString());
    }
  };

  const handlePercentageChange = (value: string) => {
    setPercentage(value);
    if (originalDimensions && value) {
      const percent = parseFloat(value) / 100;
      const newWidth = Math.round(originalDimensions.width * percent);
      const newHeight = Math.round(originalDimensions.height * percent);
      setTargetWidth(newWidth.toString());
      setTargetHeight(newHeight.toString());
    }
  };

  const applyPresetSize = (preset: { width: number; height: number }) => {
    setTargetWidth(preset.width.toString());
    setTargetHeight(preset.height.toString());
    setResizeMode('pixels');
  };

  const resizeImage = async () => {
    if (!selectedFile || !originalDimensions) return;

    const width = parseInt(targetWidth);
    const height = parseInt(targetHeight);

    if (!width || !height || width <= 0 || height <= 0) {
      toast({
        title: '参数错误',
        description: '请输入有效的宽度和高度',
        variant: 'destructive',
      });
      return;
    }

    setIsResizing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        // 使用高质量缩放
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResizedImage({
            blob,
            url,
            width,
            height,
            size: blob.size
          });
          toast({
            title: '调整成功',
            description: `图片尺寸已调整为 ${width} x ${height} 像素`,
          });
        }
      }, selectedFile.type, 0.95);
    } catch (error) {
      toast({
        title: '调整失败',
        description: '图片尺寸调整过程中出现错误',
        variant: 'destructive',
      });
    } finally {
      setIsResizing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedImage || !selectedFile) return;

    const link = document.createElement('a');
    link.href = resizedImage.url;
    const originalName = selectedFile.name.split('.')[0];
    const extension = selectedFile.name.split('.').pop();
    link.download = `${originalName}_${resizedImage.width}x${resizedImage.height}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFiles = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setOriginalDimensions(null);
    setResizedImage(null);
    setTargetWidth('');
    setTargetHeight('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Maximize2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">图片尺寸调整</h1>
          </div>
          <p className="text-gray-600">调整图片尺寸、分辨率，支持按比例缩放和自定义尺寸</p>
          <Badge variant="secondary" className="mt-2">图像工具</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 上传区域 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                上传图片
              </CardTitle>
              <CardDescription>
                支持 JPG、PNG、GIF、WebP 等格式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="max-w-full max-h-32 mx-auto rounded-lg shadow-md"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p>{formatFileSize(selectedFile?.size || 0)}</p>
                      {originalDimensions && (
                        <p>{originalDimensions.width} x {originalDimensions.height} px</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFiles();
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      清除
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">点击或拖拽上传图片</p>
                      <p className="text-sm text-gray-500 mt-1">支持多种图片格式</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 调整设置 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                尺寸设置
              </CardTitle>
              <CardDescription>
                设置新的图片尺寸和缩放参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 调整模式 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">调整模式</Label>
                <Select value={resizeMode} onValueChange={(value: 'pixels' | 'percentage') => setResizeMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pixels">像素尺寸</SelectItem>
                    <SelectItem value="percentage">百分比缩放</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resizeMode === 'percentage' ? (
                <div>
                  <Label htmlFor="percentage" className="text-sm font-medium mb-2 block">
                    缩放百分比 (%)
                  </Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(e.target.value)}
                    placeholder="100"
                    min="1"
                    max="1000"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-sm font-medium mb-2 block">
                      宽度 (px)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      placeholder="宽度"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium mb-2 block">
                      高度 (px)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      placeholder="高度"
                      min="1"
                    />
                  </div>
                </div>
              )}

              {/* 保持纵横比 */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
                <Label htmlFor="aspect-ratio" className="flex items-center gap-2">
                  {maintainAspectRatio ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                  保持纵横比
                </Label>
              </div>

              {/* 预设尺寸 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">常用尺寸</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetSizes.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPresetSize(preset)}
                      className="text-xs"
                    >
                      {preset.name}
                      <br />
                      <span className="text-gray-500">{preset.width}x{preset.height}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={resizeImage}
                disabled={!selectedFile || !targetWidth || !targetHeight || isResizing}
                className="w-full"
              >
                {isResizing ? (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2 animate-pulse" />
                    调整中...
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    开始调整
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 调整结果 */}
        {resizedImage && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                调整结果
              </CardTitle>
              <CardDescription>
                尺寸调整完成，可以下载新图片
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">原图片</h4>
                  <div className="border rounded-lg p-4">
                    <img
                      src={previewUrl}
                      alt="原图"
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                    <div className="text-sm text-gray-600 mt-2 text-center">
                      {originalDimensions && (
                        <>
                          <p>尺寸: {originalDimensions.width} x {originalDimensions.height} px</p>
                          <p>大小: {formatFileSize(selectedFile?.size || 0)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">调整后</h4>
                  <div className="border rounded-lg p-4">
                    <img
                      src={resizedImage.url}
                      alt="调整后"
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                    <div className="text-sm text-gray-600 mt-2 text-center">
                      <p>尺寸: {resizedImage.width} x {resizedImage.height} px</p>
                      <p>大小: {formatFileSize(resizedImage.size)}</p>
                      {originalDimensions && (
                        <p className="text-green-600">
                          压缩比: {((resizedImage.size / (selectedFile?.size || 1)) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={downloadImage} className="w-full mt-4">
                <Download className="w-4 h-4 mr-2" />
                下载调整后的图片
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageResizer;