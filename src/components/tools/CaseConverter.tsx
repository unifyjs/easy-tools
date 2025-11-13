import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  ArrowUpDown,
  Copy,
  RotateCcw,
  Heart,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const CaseConverterTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [likes, setLikes] = useState(4400);
  const [isLiked, setIsLiked] = useState(false);

  // 大小写转换函数
  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'toggle' | 'camel' | 'pascal' | 'snake') => {
    if (!inputText.trim()) {
      toast.error('请输入要转换的文本');
      return;
    }

    let result = '';
    
    switch (type) {
      case 'upper':
        result = inputText.toUpperCase();
        break;
      case 'lower':
        result = inputText.toLowerCase();
        break;
      case 'title':
        result = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'toggle':
        result = inputText.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('');
        break;
      case 'camel':
        result = inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'pascal':
        result = inputText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
          word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'snake':
        result = inputText.replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
        break;
    }
    
    setOutputText(result);
    toast.success('转换完成！');
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    if (!outputText) {
      toast.error('没有可复制的内容');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success('已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  // 清空内容
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    toast.success('内容已清空');
  };

  // 点赞功能
  const handleLike = () => {
    if (!isLiked) {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      toast.success('感谢您的点赞！');
    } else {
      setLikes(prev => prev - 1);
      setIsLiked(false);
      toast.success('已取消点赞');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 工具标题和统计 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center float-animation">
            <ArrowUpDown className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold category-title">英文字母大小写转换</h1>
            <p className="text-muted-foreground">支持多种大小写转换格式</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likes.toLocaleString()}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div>访问量: 4400万+</div>
        </div>
      </div>

      {/* 转换工具 */}
      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            文本转换
          </CardTitle>
          <CardDescription>
            在下方输入要转换的英文文本，选择转换类型即可快速转换
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 输入区域 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">输入文本</label>
            <Textarea
              placeholder="请输入要转换的英文文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="text-xs text-muted-foreground">
              字符数: {inputText.length}
            </div>
          </div>

          {/* 转换按钮 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => convertCase('upper')}
              className="btn-gradient"
              disabled={!inputText.trim()}
            >
              全部大写
            </Button>
            <Button
              onClick={() => convertCase('lower')}
              className="btn-gradient"
              disabled={!inputText.trim()}
            >
              全部小写
            </Button>
            <Button
              onClick={() => convertCase('title')}
              className="btn-gradient"
              disabled={!inputText.trim()}
            >
              标题格式
            </Button>
            <Button
              onClick={() => convertCase('sentence')}
              className="btn-gradient"
              disabled={!inputText.trim()}
            >
              句子格式
            </Button>
            <Button
              onClick={() => convertCase('toggle')}
              variant="outline"
              disabled={!inputText.trim()}
            >
              大小写切换
            </Button>
            <Button
              onClick={() => convertCase('camel')}
              variant="outline"
              disabled={!inputText.trim()}
            >
              驼峰命名
            </Button>
            <Button
              onClick={() => convertCase('pascal')}
              variant="outline"
              disabled={!inputText.trim()}
            >
              帕斯卡命名
            </Button>
            <Button
              onClick={() => convertCase('snake')}
              variant="outline"
              disabled={!inputText.trim()}
            >
              下划线命名
            </Button>
          </div>

          {/* 输出区域 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">转换结果</label>
            <Textarea
              placeholder="转换结果将显示在这里..."
              value={outputText}
              readOnly
              className="min-h-[120px] resize-none bg-secondary/50"
            />
            <div className="text-xs text-muted-foreground">
              字符数: {outputText.length}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button
              onClick={copyToClipboard}
              disabled={!outputText}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              复制结果
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              清空内容
            </Button>
            <Button
              onClick={handleLike}
              variant="outline"
              className={isLiked ? 'text-red-500 border-red-200' : ''}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="tool-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">基础转换</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>全部大写:</strong> 将所有字母转为大写</li>
                <li>• <strong>全部小写:</strong> 将所有字母转为小写</li>
                <li>• <strong>标题格式:</strong> 每个单词首字母大写</li>
                <li>• <strong>句子格式:</strong> 句首字母大写</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">编程命名</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>驼峰命名:</strong> firstName (首字母小写)</li>
                <li>• <strong>帕斯卡命名:</strong> FirstName (首字母大写)</li>
                <li>• <strong>下划线命名:</strong> first_name</li>
                <li>• <strong>大小写切换:</strong> 反转当前大小写</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>小贴士:</strong> 支持批量文本处理，可以同时转换多行文本。转换结果可以直接复制使用。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseConverterTool;