import React from 'react';
import ToolPage from '@/components/ToolPage';
import { Key } from 'lucide-react';

const PasswordGenerator = () => {
  return (
    <ToolPage
      title="密码生成器"
      description="生成安全的随机密码，可自定义长度和字符集"
      category="生成工具"
      icon={<Key className="w-8 h-8 text-yellow-400" />}
    />
  );
};

export default PasswordGenerator;