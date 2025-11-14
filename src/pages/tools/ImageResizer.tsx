import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Maximize2 } from 'lucide-react';

const ImageResizer = () => {
  return (
    <ToolPage
      title="图片尺寸调整"
      description="调整图片尺寸和分辨率"
      category="图像工具"
      icon={<Maximize2 className="w-8 h-8 text-purple-400" />}
    />
  );
};

export default ImageResizer;