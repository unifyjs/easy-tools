import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Link } from 'lucide-react';

const UrlEncoder = () => {
  return (
    <ToolPage
      title="URL编解码"
      description="URL编码和解码工具，处理特殊字符"
      category="代码工具"
      icon={<Link className="w-8 h-8 text-blue-400" />}
    />
  );
};

export default UrlEncoder;