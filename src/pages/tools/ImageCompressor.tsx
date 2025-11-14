import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Minimize2 } from 'lucide-react';

const ImageCompressor = () => {
  return (
    <ToolPage
      title="图片压缩"
      description="压缩图片文件大小，保持质量"
      category="图像工具"
      icon={<Minimize2 className="w-8 h-8 text-purple-400" />}
    />
  );
};

export default ImageCompressor;