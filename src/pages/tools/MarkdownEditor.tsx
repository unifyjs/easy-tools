import React from 'react';
import ToolPage from '@/components/ToolPage';
import { FileText } from 'lucide-react';

const MarkdownEditor = () => {
  return (
    <ToolPage
      title="Markdown编辑器"
      description="在线Markdown编辑器，支持实时预览和导出"
      category="文本工具"
      icon={<FileText className="w-8 h-8 text-orange-400" />}
    />
  );
};

export default MarkdownEditor;