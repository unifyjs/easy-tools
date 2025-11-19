import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, Upload, Download, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConvertedImage {
  blob: Blob;
  url: string;
  format: string;
  size: number;
}

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<string>('png');
  const [quality, setQuality] = useState<number[]>([90]);
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'png', label: 'PNG', description: '无损压缩，支持透明' },
    { value: 'jpeg', label: 'JPEG', description: '有损压缩，文件较小' },
    { value: 'webp', label: 'WebP', description: '现代格式，压缩率高' },
    { value: 'bmp', label: 'BMP', description: '位图格式，无压缩' },
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
    setConvertedImage(null);
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

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // 如果目标格式是JPEG，先填充白色背景
        if (targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
      }

      const mimeType = targetFormat === 'jpeg' ? 'image/jpeg' : `image/${targetFormat}`;
      const qualityValue = targetFormat === 'jpeg' || targetFormat === 'webp' ? quality[0] / 100 : undefined;

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setConvertedImage({
            blob,
            url,
            format: targetFormat,
            size: blob.size
          });
          toast({
            title: '转换成功',
            description: `图片已转换为 ${targetFormat.toUpperCase()} 格式`,
          });
        }
      }, mimeType, qualityValue);
    } catch (error) {
      toast({
        title: '转换失败',
        description: '图片转换过程中出现错误',
        variant: 'destructive',
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedImage || !selectedFile) return;

    const link = document.createElement('a');
    link.href = convertedImage.url;
    const originalName = selectedFile.name.split('.')[0];
    link.download = `${originalName}_converted.${convertedImage.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFiles = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setConvertedImage(null);
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
    <>
      <SEOHead toolId="image-converter" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">图片格式转换</h1>
            </div>
            <p className="text-gray-600">支持 PNG、JPEG、WebP、BMP 等多种格式之间的转换</p>
            <Badge variant="secondary" className="mt-2">图像工具</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 上传区域 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  上传图片
                </CardTitle>
                <CardDescription>
                  支持 JPG、PNG、GIF、WebP、BMP 等格式
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
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
                        className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{selectedFile?.name}</p>
                        <p>{formatFileSize(selectedFile?.size || 0)}</p>
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

            {/* 转换设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  转换设置
                </CardTitle>
                <CardDescription>
                  选择目标格式和质量设置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">目标格式</label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-gray-500">{format.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      图片质量: {quality[0]}%
                    </label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>低质量 (小文件)</span>
                      <span>高质量 (大文件)</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={convertImage}
                  disabled={!selectedFile || isConverting}
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      转换中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      开始转换
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 转换结果 */}
          {convertedImage && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  转换结果
                </CardTitle>
                <CardDescription>
                  转换完成，可以下载新图片
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
                        className="max-w-full max-h-32 mx-auto rounded"
                      />
                      <div className="text-sm text-gray-600 mt-2 text-center">
                        <p>格式: {selectedFile?.type.split('/')[1]?.toUpperCase()}</p>
                        <p>大小: {formatFileSize(selectedFile?.size || 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">转换后</h4>
                    <div className="border rounded-lg p-4">
                      <img
                        src={convertedImage.url}
                        alt="转换后"
                        className="max-w-full max-h-32 mx-auto rounded"
                      />
                      <div className="text-sm text-gray-600 mt-2 text-center">
                        <p>格式: {convertedImage.format.toUpperCase()}</p>
                        <p>大小: {formatFileSize(convertedImage.size)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={downloadImage} className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  下载转换后的图片
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>  
    </>
  );
};

export default ImageConverter;