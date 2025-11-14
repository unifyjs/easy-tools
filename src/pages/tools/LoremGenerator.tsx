import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Type } from 'lucide-react';

const LoremGenerator = () => {
  return (
    <ToolPage
      title="Lorem文本生成"
      description="生成Lorem ipsum占位文本"
      category="生成工具"
      icon={<Type className="w-8 h-8 text-yellow-400" />}
    />
  );
};

export default LoremGenerator;