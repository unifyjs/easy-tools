import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Crop, Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, X, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageData {
  id: string;
  file: File;
  url: string;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  cropArea: CropArea;
}

const ASPECT_RATIOS = [
  { label: '自由裁剪', value: 'free', ratio: null },
  { label: '1:1 (正方形)', value: '1:1', ratio: 1 },
  { label: '4:3', value: '4:3', ratio: 4/3 },
  { label: '3:4', value: '3:4', ratio: 3/4 },
  { label: '16:9', value: '16:9', ratio: 16/9 },
  { label: '9:16', value: '9:16', ratio: 9/16 },
  { label: '3:2', value: '3:2', ratio: 3/2 },
  { label: '2:3', value: '2:3', ratio: 2/3 },
];

const ImageCropper = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputQuality, setOutputQuality] = useState(90);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedImage = images.find(img => img.id === selectedImageId);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "文件格式错误",
          description: `${file.name} 不是有效的图片文件`,
          variant: "destructive",
        });
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const maxDisplaySize = 600;
        const scale = Math.min(maxDisplaySize / img.naturalWidth, maxDisplaySize / img.naturalHeight, 1);
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;

        const newImage: ImageData = {
          id,
          file,
          url,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth,
          displayHeight,
          rotation: 0,
          flipX: false,
          flipY: false,
          cropArea: {
            x: displayWidth * 0.1,
            y: displayHeight * 0.1,
            width: displayWidth * 0.8,
            height: displayHeight * 0.8,
          }
        };

        setImages(prev => [...prev, newImage]);
        if (!selectedImageId) {
          setSelectedImageId(id);
        }
      };

      img.src = url;
    });
  }, [selectedImageId, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const updateCropArea = useCallback((newCropArea: Partial<CropArea>) => {
    if (!selectedImage) return;

    setImages(prev => prev.map(img => 
      img.id === selectedImageId 
        ? { ...img, cropArea: { ...img.cropArea, ...newCropArea } }
        : img
    ));
  }, [selectedImage, selectedImageId]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;

    const imageContainer = imageRef.current?.parentElement;
    if (!imageContainer) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ x, y });
  }, [selectedImage]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!selectedImage || (!isDragging && !isResizing)) return;

    const imageContainer = imageRef.current?.parentElement;
    if (!imageContainer) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    if (isDragging) {
      const newX = Math.max(0, Math.min(selectedImage.displayWidth - selectedImage.cropArea.width, selectedImage.cropArea.x + deltaX));
      const newY = Math.max(0, Math.min(selectedImage.displayHeight - selectedImage.cropArea.height, selectedImage.cropArea.y + deltaY));
      
      updateCropArea({ x: newX, y: newY });
      setDragStart({ x, y });
    } else if (isResizing) {
      let newCropArea = { ...selectedImage.cropArea };
      const currentRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio)?.ratio;

      switch (resizeHandle) {
        case 'nw':
          newCropArea.width = Math.max(20, selectedImage.cropArea.width - deltaX);
          newCropArea.height = Math.max(20, selectedImage.cropArea.height - deltaY);
          newCropArea.x = selectedImage.cropArea.x + deltaX;
          newCropArea.y = selectedImage.cropArea.y + deltaY;
          break;
        case 'ne':
          newCropArea.width = Math.max(20, selectedImage.cropArea.width + deltaX);
          newCropArea.height = Math.max(20, selectedImage.cropArea.height - deltaY);
          newCropArea.y = selectedImage.cropArea.y + deltaY;
          break;
        case 'sw':
          newCropArea.width = Math.max(20, selectedImage.cropArea.width - deltaX);
          newCropArea.height = Math.max(20, selectedImage.cropArea.height + deltaY);
          newCropArea.x = selectedImage.cropArea.x + deltaX;
          break;
        case 'se':
          newCropArea.width = Math.max(20, selectedImage.cropArea.width + deltaX);
          newCropArea.height = Math.max(20, selectedImage.cropArea.height + deltaY);
          break;
      }

      // 应用宽高比约束
      if (currentRatio) {
        if (resizeHandle.includes('e')) {
          newCropArea.height = newCropArea.width / currentRatio;
        } else {
          newCropArea.width = newCropArea.height * currentRatio;
        }
      }

      // 确保裁剪区域在图片范围内
      newCropArea.x = Math.max(0, Math.min(selectedImage.displayWidth - newCropArea.width, newCropArea.x));
      newCropArea.y = Math.max(0, Math.min(selectedImage.displayHeight - newCropArea.height, newCropArea.y));
      newCropArea.width = Math.min(selectedImage.displayWidth - newCropArea.x, newCropArea.width);
      newCropArea.height = Math.min(selectedImage.displayHeight - newCropArea.y, newCropArea.height);

      updateCropArea(newCropArea);
      setDragStart({ x, y });
    }
  }, [selectedImage, isDragging, isResizing, dragStart, aspectRatio, resizeHandle, updateCropArea]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  // 添加全局事件监听器
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleAspectRatioChange = useCallback((value: string) => {
    setAspectRatio(value);
    if (!selectedImage) return;

    const ratio = ASPECT_RATIOS.find(r => r.value === value)?.ratio;
    if (ratio) {
      const { cropArea } = selectedImage;
      const centerX = cropArea.x + cropArea.width / 2;
      const centerY = cropArea.y + cropArea.height / 2;
      
      let newWidth = cropArea.width;
      let newHeight = cropArea.width / ratio;
      
      if (newHeight > selectedImage.displayHeight * 0.8) {
        newHeight = selectedImage.displayHeight * 0.8;
        newWidth = newHeight * ratio;
      }
      
      const newX = Math.max(0, Math.min(selectedImage.displayWidth - newWidth, centerX - newWidth / 2));
      const newY = Math.max(0, Math.min(selectedImage.displayHeight - newHeight, centerY - newHeight / 2));
      
      updateCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [selectedImage, updateCropArea]);

  const rotateImage = useCallback((degrees: number) => {
    if (!selectedImage) return;

    setImages(prev => prev.map(img => 
      img.id === selectedImageId 
        ? { ...img, rotation: (img.rotation + degrees) % 360 }
        : img
    ));
  }, [selectedImage, selectedImageId]);

  const flipImage = useCallback((axis: 'x' | 'y') => {
    if (!selectedImage) return;

    setImages(prev => prev.map(img => 
      img.id === selectedImageId 
        ? { 
            ...img, 
            [axis === 'x' ? 'flipX' : 'flipY']: !img[axis === 'x' ? 'flipX' : 'flipY']
          }
        : img
    ));
  }, [selectedImage, selectedImageId]);

  const cropImage = useCallback(async () => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算实际裁剪区域（相对于原始图片尺寸）
    const scaleX = selectedImage.naturalWidth / selectedImage.displayWidth;
    const scaleY = selectedImage.naturalHeight / selectedImage.displayHeight;
    
    const actualCropArea = {
      x: selectedImage.cropArea.x * scaleX,
      y: selectedImage.cropArea.y * scaleY,
      width: selectedImage.cropArea.width * scaleX,
      height: selectedImage.cropArea.height * scaleY,
    };

    // 设置输出尺寸
    let outputWidth = actualCropArea.width;
    let outputHeight = actualCropArea.height;
    
    if (customWidth && customHeight) {
      outputWidth = parseInt(customWidth);
      outputHeight = parseInt(customHeight);
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // 创建临时图片元素
    const img = new Image();
    img.onload = () => {
      // 应用变换
      ctx.save();
      
      // 移到画布中心
      ctx.translate(outputWidth / 2, outputHeight / 2);
      
      // 应用旋转
      if (selectedImage.rotation !== 0) {
        ctx.rotate((selectedImage.rotation * Math.PI) / 180);
      }
      
      // 应用翻转
      ctx.scale(selectedImage.flipX ? -1 : 1, selectedImage.flipY ? -1 : 1);
      
      // 绘制裁剪的图片
      ctx.drawImage(
        img,
        actualCropArea.x,
        actualCropArea.y,
        actualCropArea.width,
        actualCropArea.height,
        -outputWidth / 2,
        -outputHeight / 2,
        outputWidth,
        outputHeight
      );
      
      ctx.restore();

      // 导出图片
      const quality = outputFormat === 'jpeg' ? outputQuality / 100 : undefined;
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `cropped_${selectedImage.file.name.split('.')[0]}.${outputFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "裁剪完成",
            description: `图片已成功裁剪并下载`,
          });
        }
      }, `image/${outputFormat}`, quality);
    };

    img.src = selectedImage.url;
  }, [selectedImage, customWidth, customHeight, outputFormat, outputQuality, toast]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return filtered;
    });
    
    if (selectedImageId === imageId) {
      const remainingImages = images.filter(img => img.id !== imageId);
      setSelectedImageId(remainingImages.length > 0 ? remainingImages[0].id : null);
    }
  }, [images, selectedImageId]);

  // 清理 URL 对象
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Crop className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">图片裁剪工具</h1>
        </div>
        <p className="text-muted-foreground">
          上传图片进行裁剪、旋转、翻转等编辑操作
        </p>
      </div>

      {/* 文件上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传图片
          </CardTitle>
          <CardDescription>
            支持 JPG、PNG、WebP 等格式，可同时上传多张图片
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">拖拽图片到此处或点击上传</p>
            <p className="text-sm text-muted-foreground mb-4">
              支持 JPG、PNG、WebP 格式
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              选择文件
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 图片列表 */}
          <Card>
            <CardHeader>
              <CardTitle>图片列表</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedImageId === image.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <img
                    src={image.url}
                    alt={image.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{image.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {image.naturalWidth} × {image.naturalHeight} • {formatBytes(image.file.size)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 编辑区域 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>图片编辑</CardTitle>
              {selectedImage && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedImage.naturalWidth} × {selectedImage.naturalHeight}
                  </Badge>
                  <Badge variant="outline">
                    {formatBytes(selectedImage.file.size)}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                <div className="space-y-6">
                  {/* 工具栏 */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rotateImage(-90)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      左转90°
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rotateImage(90)}
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      右转90°
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => flipImage('x')}
                    >
                      <FlipHorizontal className="w-4 h-4 mr-2" />
                      水平翻转
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => flipImage('y')}
                    >
                      <FlipVertical className="w-4 h-4 mr-2" />
                      垂直翻转
                    </Button>
                  </div>

                  {/* 裁剪预览 */}
                  <div className="relative inline-block border rounded-lg overflow-hidden">
                    <div
                      className="relative"
                      style={{
                        width: selectedImage.displayWidth,
                        height: selectedImage.displayHeight,
                      }}
                    >
                      <img
                        ref={imageRef}
                        src={selectedImage.url}
                        alt="Preview"
                        className="block"
                        style={{
                          width: selectedImage.displayWidth,
                          height: selectedImage.displayHeight,
                          transform: `rotate(${selectedImage.rotation}deg) scaleX(${selectedImage.flipX ? -1 : 1}) scaleY(${selectedImage.flipY ? -1 : 1})`,
                        }}
                        draggable={false}
                      />
                      
                      {/* 裁剪区域 */}
                      <div
                        ref={cropAreaRef}
                        className="absolute border-2 border-primary bg-primary/10 cursor-move"
                        style={{
                          left: selectedImage.cropArea.x,
                          top: selectedImage.cropArea.y,
                          width: selectedImage.cropArea.width,
                          height: selectedImage.cropArea.height,
                        }}
                        onMouseDown={handleMouseDown}
                      >
                        {/* 调整手柄 */}
                        <div
                          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nw-resize -top-2 -left-2 hover:bg-primary/80 transition-colors z-10"
                          onMouseDown={(e) => handleMouseDown(e, 'nw')}
                        />
                        <div
                          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-ne-resize -top-2 -right-2 hover:bg-primary/80 transition-colors z-10"
                          onMouseDown={(e) => handleMouseDown(e, 'ne')}
                        />
                        <div
                          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-sw-resize -bottom-2 -left-2 hover:bg-primary/80 transition-colors z-10"
                          onMouseDown={(e) => handleMouseDown(e, 'sw')}
                        />
                        <div
                          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-se-resize -bottom-2 -right-2 hover:bg-primary/80 transition-colors z-10"
                          onMouseDown={(e) => handleMouseDown(e, 'se')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 裁剪设置 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label>宽高比</Label>
                        <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ASPECT_RATIOS.map((ratio) => (
                              <SelectItem key={ratio.value} value={ratio.value}>
                                {ratio.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>自定义宽度</Label>
                          <Input
                            type="number"
                            placeholder="像素"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>自定义高度</Label>
                          <Input
                            type="number"
                            placeholder="像素"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>输出格式</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {outputFormat === 'jpeg' && (
                        <div>
                          <Label>JPEG 质量: {outputQuality}%</Label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={outputQuality}
                            onChange={(e) => setOutputQuality(parseInt(e.target.value))}
                            className="w-full mt-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-center">
                    <Button onClick={cropImage} size="lg" className="px-8">
                      <Download className="w-4 h-4 mr-2" />
                      裁剪并下载
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">请选择要编辑的图片</p>
                  <p className="text-muted-foreground">从左侧列表中选择一张图片开始编辑</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 隐藏的画布用于图片处理 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;