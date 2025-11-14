import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Fingerprint } from 'lucide-react';

const UuidGenerator = () => {
  return (
    <ToolPage
      title="UUID生成器"
      description="生成各种版本的UUID/GUID"
      category="生成工具"
      icon={<Fingerprint className="w-8 h-8 text-yellow-400" />}
    />
  );
};

export default UuidGenerator;