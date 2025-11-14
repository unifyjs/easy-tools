import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Search } from 'lucide-react';

const RegexTester = () => {
  return (
    <ToolPage
      title="正则表达式测试"
      description="测试和验证正则表达式，支持多种编程语言"
      category="文本工具"
      icon={<Search className="w-8 h-8 text-orange-400" />}
    />
  );
};

export default RegexTester;