import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Hash } from 'lucide-react';

const NumberBaseConverter = () => {
  return (
    <ToolPage
      title="进制转换"
      description="二进制、八进制、十进制、十六进制之间的转换"
      category="转换工具"
      icon={<Hash className="w-8 h-8 text-green-400" />}
    />
  );
};

export default NumberBaseConverter;