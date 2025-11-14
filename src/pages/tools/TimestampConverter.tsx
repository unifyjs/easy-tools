import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Clock } from 'lucide-react';

const TimestampConverter = () => {
  return (
    <ToolPage
      title="时间戳转换"
      description="时间戳与日期时间之间的相互转换"
      category="转换工具"
      icon={<Clock className="w-8 h-8 text-green-400" />}
    />
  );
};

export default TimestampConverter;