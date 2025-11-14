import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolPageProps {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

const ToolPage: React.FC<ToolPageProps> = ({ title, description, category, icon }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              {icon || <Wrench className="w-8 h-8 text-blue-500" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          </div>
          <Badge variant="outline" className="mb-6">{category}</Badge>
        </div>

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