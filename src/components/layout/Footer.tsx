import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <a href="#" className="hover:text-primary">关于</a>
        <a href="#" className="hover:text-primary">反馈</a>
        <a href="#" className="hover:text-primary">会员</a>
        <a href="#" className="hover:text-primary">文章</a>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        © 2025 易用工具 版权所有
      </div>
    </div>
  );
};

export default Footer;