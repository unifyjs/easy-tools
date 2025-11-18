import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Minimize2, Upload, Download, X, Image as ImageIcon, FileImage, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  originalUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedUrl: string | null;
  compressionRatio: number;
  format: string;
  quality: number;
}

const ImageCompressor = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = useCallback(async (file: File, quality: number, format: string): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx?.drawImage(img, 0, 0);

        // 转换为指定格式和质量
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          `image/${format}`,
          quality / 100
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const processImages = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    const newImages: CompressedImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "文件格式错误",
          description: `${file.name} 不是有效的图片文件`,
          variant: "destructive",
        });
        continue;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const originalUrl = URL.createObjectURL(file);

      try {
        const compressedBlob = await compressImage(file, quality[0], format);
        const compressedUrl = URL.createObjectURL(compressedBlob);
        const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;

        newImages.push({
          id,
          originalFile: file,
          originalSize: file.size,
          originalUrl,
          compressedBlob,
          compressedSize: compressedBlob.size,
          compressedUrl,
          compressionRatio,
          format,
          quality: quality[0],
        });
      } catch (error) {
        toast({
          title: "压缩失败",
          description: `${file.name} 压缩失败`,
          variant: "destructive",
        });
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);

    if (newImages.length > 0) {
      toast({
        title: "压缩完成",
        description: `成功压缩 ${newImages.length} 张图片`,
      });
    }
  }, [quality, format, compressImage, toast]);

  const recompressImage = useCallback(async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setIsProcessing(true);

    try {
      const compressedBlob = await compressImage(image.originalFile, quality[0], format);
      const compressedUrl = URL.createObjectURL(compressedBlob);
      const compressionRatio = ((image.originalSize - compressedBlob.size) / image.originalSize) * 100;

      // 清理旧的 URL
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }

      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? {
              ...img,
              compressedBlob,
              compressedSize: compressedBlob.size,
              compressedUrl,
              compressionRatio,
              format,
              quality: quality[0],
            }
          : img
      ));

      toast({
        title: "重新压缩完成",
        description: "图片已使用新设置重新压缩",
      });
    } catch (error) {
      toast({
        title: "压缩失败",
        description: "重新压缩图片时出错",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  }, [images, quality, format, compressImage, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processImages(files);
    }
  }, [processImages]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processImages(files);
    }
  }, [processImages]);

  const downloadImage = useCallback((image: CompressedImage) => {
    if (!image.compressedBlob) return;

    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.originalFile.name.split('.')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [format]);

  const downloadAll = useCallback(() => {
    images.forEach(image => {
      if (image.compressedBlob) {
        setTimeout(() => downloadImage(image), 100);
      }
    });
  }, [images, downloadImage]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.originalUrl);
        if (image.compressedUrl) {
          URL.revokeObjectURL(image.compressedUrl);
        }
      }
      return prev.filter(img => img.id !== imageId);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }
    });
    setImages([]);
  }, [images]);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Minimize2 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">图片压缩工具</h1>
              <p className="text-gray-600 mt-1">压缩图片文件大小，保持最佳质量</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            图像工具
          </Badge>
        </div>

        {/* 设置面板 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              压缩设置
            </CardTitle>
            <CardDescription>
              调整压缩质量和输出格式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">压缩质量: {quality[0]}%</label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  质量越高，文件越大；质量越低，压缩率越高
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">输出格式</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  WebP 格式通常有更好的压缩效果
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 上传区域 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                拖拽图片到此处或点击上传
              </h3>
              <p className="text-gray-600 mb-4">
                支持 JPG、PNG、WebP 等格式，可同时上传多张图片
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                选择图片
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* 处理进度 */}
        {isProcessing && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-sm text-gray-600">正在处理图片...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 图片列表 */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    压缩结果 ({images.length})
                  </CardTitle>
                  <CardDescription>
                    查看压缩效果并下载图片
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadAll}
                    disabled={images.length === 0}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载全部
                  </Button>
                  <Button
                    onClick={clearAll}
                    disabled={images.length === 0}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清空
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* 原图预览 */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">原图</h4>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.originalUrl}
                            alt="原图"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>大小: {formatBytes(image.originalSize)}</p>
                          <p>文件名: {image.originalFile.name}</p>
                        </div>
                      </div>

                      {/* 压缩后预览 */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">压缩后</h4>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {image.compressedUrl ? (
                            <img
                              src={image.compressedUrl}
                              alt="压缩后"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400">处理中...</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>大小: {formatBytes(image.compressedSize)}</p>
                          <p>格式: {image.format.toUpperCase()}</p>
                          <p>质量: {image.quality}%</p>
                        </div>
                      </div>

                      {/* 操作和统计 */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-700">压缩效果</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>压缩率:</span>
                              <span className={`font-medium ${
                                image.compressionRatio > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {image.compressionRatio > 0 ? '-' : '+'}{Math.abs(image.compressionRatio).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>节省空间:</span>
                              <span className="font-medium">
                                {formatBytes(Math.abs(image.originalSize - image.compressedSize))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={() => recompressImage(image.id)}
                            disabled={isProcessing}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            重新压缩
                          </Button>
                          <Button
                            onClick={() => downloadImage(image)}
                            disabled={!image.compressedBlob}
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            下载
                          </Button>
                          <Button
                            onClick={() => removeImage(image.id)}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-2" />
                            移除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">功能特点</h4>
                <ul className="space-y-1">
                  <li>• 支持批量压缩多张图片</li>
                  <li>• 实时预览压缩效果</li>
                  <li>• 可调节压缩质量</li>
                  <li>• 支持多种输出格式</li>
                  <li>• 显示详细压缩统计</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用技巧</h4>
                <ul className="space-y-1">
                  <li>• JPEG 适合照片，PNG 适合图标</li>
                  <li>• WebP 格式压缩效果最佳</li>
                  <li>• 质量 80% 通常是最佳平衡点</li>
                  <li>• 可以重新调整设置并重新压缩</li>
                  <li>• 支持拖拽上传，操作更便捷</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageCompressor;