import React from 'react';
import ToolPage from '@/components/ToolPage';
import { FileText } from 'lucide-react';

const WhoisLookup = () => {
  return (
    <ToolPage
      title="Whois查询"
      description="查询域名的注册信息"
      category="网络工具"
      icon={<FileText className="w-8 h-8 text-cyan-400" />}
    />
  );
};

export default WhoisLookup;