import React from 'react';
import ToolPage from '@/components/ToolPage';
import { QrCode } from 'lucide-react';

const QrGenerator = () => {
  return (
    <ToolPage
      title="二维码生成"
      description="生成各种类型的二维码，支持自定义样式"
      category="生成工具"
      icon={<QrCode className="w-8 h-8 text-yellow-400" />}
    />
  );
};

export default QrGenerator;