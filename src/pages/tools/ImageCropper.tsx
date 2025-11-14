import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Crop } from 'lucide-react';

const ImageCropper = () => {
  return (
    <ToolPage
      title="图片裁剪"
      description="裁剪和编辑图片"
      category="图像工具"
      icon={<Crop className="w-8 h-8 text-purple-400" />}
    />
  );
};

export default ImageCropper;