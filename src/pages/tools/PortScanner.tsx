import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Scan } from 'lucide-react';

const PortScanner = () => {
  return (
    <ToolPage
      title="端口扫描"
      description="扫描主机的开放端口"
      category="网络工具"
      icon={<Scan className="w-8 h-8 text-cyan-400" />}
    />
  );
};

export default PortScanner;