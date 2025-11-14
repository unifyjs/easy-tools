import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Code } from 'lucide-react';

const CodeFormatter = () => {
  return (
    <ToolPage
      title="代码格式化"
      description="格式化JavaScript、CSS、HTML等代码，提高可读性"
      category="代码工具"
      icon={<Code className="w-8 h-8 text-blue-400" />}
    />
  );
};

export default CodeFormatter;