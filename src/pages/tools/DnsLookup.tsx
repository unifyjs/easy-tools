import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Search } from 'lucide-react';

const DnsLookup = () => {
  return (
    <ToolPage
      title="DNS查询"
      description="查询域名的DNS记录信息"
      category="网络工具"
      icon={<Search className="w-8 h-8 text-cyan-400" />}
    />
  );
};

export default DnsLookup;