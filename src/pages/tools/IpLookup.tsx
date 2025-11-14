import React from 'react';
import ToolPage from '@/components/ToolPage';
import { MapPin } from 'lucide-react';

const IpLookup = () => {
  return (
    <ToolPage
      title="IP地址查询"
      description="查询IP地址的地理位置和相关信息"
      category="网络工具"
      icon={<MapPin className="w-8 h-8 text-cyan-400" />}
    />
  );
};

export default IpLookup;