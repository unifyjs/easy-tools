import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Ruler } from 'lucide-react';

const UnitConverter = () => {
  return (
    <ToolPage
      title="单位转换"
      description="长度、重量、温度等各种单位之间的转换"
      category="转换工具"
      icon={<Ruler className="w-8 h-8 text-green-400" />}
    />
  );
};

export default UnitConverter;