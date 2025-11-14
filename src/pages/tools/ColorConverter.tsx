import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Palette } from 'lucide-react';

const ColorConverter = () => {
  return (
    <ToolPage
      title="颜色转换"
      description="RGB、HEX、HSL等颜色格式之间的转换"
      category="转换工具"
      icon={<Palette className="w-8 h-8 text-green-400" />}
    />
  );
};

export default ColorConverter;