import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface ToolPageProps {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

const ToolPage: React.FC<ToolPageProps> = ({ title, description, category, icon }) => {

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* 工具功能区域 */}
        <Card className="p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">工具功能开发中</h3>
            <p className="text-gray-600">该工具的具体功能正在开发中，敬请期待。</p>
            <Button className="mt-4" disabled>
              即将推出
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ToolPage;