import React from 'react';
import ToolPage from '@/components/ToolPage';
import { GitCompare } from 'lucide-react';

const TextDiff = () => {
  return (
    <ToolPage
      title="文本对比"
      description="比较两个文本的差异，高亮显示不同之处"
      category="文本工具"
      icon={<GitCompare className="w-8 h-8 text-orange-400" />}
    />
  );
};

export default TextDiff;