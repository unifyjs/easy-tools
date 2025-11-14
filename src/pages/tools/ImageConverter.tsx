import React from 'react';
import ToolPage from '@/components/ToolPage';
import { RefreshCw } from 'lucide-react';

const ImageConverter = () => {
  return (
    <ToolPage
      title="图片格式转换"
      description="转换图片格式：JPG、PNG、WebP等"
      category="图像工具"
      icon={<RefreshCw className="w-8 h-8 text-purple-400" />}
    />
  );
};

export default ImageConverter;