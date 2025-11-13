import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Copy, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';

const TextDedup: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputSeparator, setInputSeparator] = useState('newline');
  const [outputSeparator, setOutputSeparator] = useState('newline');
  const [likes, setLikes] = useState(2139);
  const [isLiked, setIsLiked] = useState(false);

  const separatorMap: { [key: string]: string } = {
    'newline': '\n',
    'space': ' ',
    'comma': ',',
    'comma-cn': '，',
    'slash': '/',
    'semicolon': ';',
    'semicolon-cn': '；',
    'dot': '.',
    'none': '',
    'array': "','"
  };

  const deduplicateText = () => {
    if (!inputText.trim()) {
      toast.error('请输入要处理的文本');
      return;
    }

    const sep = separatorMap[inputSeparator];
    const items = inputText.split(sep).filter(item => item.trim() !== '');
    const uniqueItems = [...new Set(items)];
    const outputSep = separatorMap[outputSeparator];
    const result = uniqueItems.join(outputSep);
    
    setOutputText(result);
    toast.success(`去重完成，共处理 ${items.length} 项，去重后剩余 ${uniqueItems.length} 项`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success('已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    toast.success('内容已清空');
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      toast.success('感谢您的点赞！');
    } else {
      setLikes(likes - 1);
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
            <span className="text-2xl">🔄</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold category-title">文本去重分隔工具</h1>
            <p className="text-muted-foreground">去除重复文本并按指定分隔符分隔</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>2139次使用</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">输入文本</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入要处理的文本内容..."
              className="min-h-[400px] resize-none"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">输入分隔符</label>
                <Select value={inputSeparator} onValueChange={setInputSeparator}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分隔符" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newline">换行符</SelectItem>
                    <SelectItem value="space">空格</SelectItem>
                    <SelectItem value="comma">英文逗号</SelectItem>
                    <SelectItem value="comma-cn">中文逗号</SelectItem>
                    <SelectItem value="slash">斜杠</SelectItem>
                    <SelectItem value="semicolon">英文分号</SelectItem>
                    <SelectItem value="semicolon-cn">中文分号</SelectItem>
                    <SelectItem value="dot">英文句号</SelectItem>
                    <SelectItem value="none">无分隔符</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">输出分隔符</label>
                <Select value={outputSeparator} onValueChange={setOutputSeparator}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分隔符" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newline">换行符</SelectItem>
                    <SelectItem value="space">空格</SelectItem>
                    <SelectItem value="comma">英文逗号</SelectItem>
                    <SelectItem value="comma-cn">中文逗号</SelectItem>
                    <SelectItem value="slash">斜杠</SelectItem>
                    <SelectItem value="semicolon">英文分号</SelectItem>
                    <SelectItem value="semicolon-cn">中文分号</SelectItem>
                    <SelectItem value="dot">英文句号</SelectItem>
                    <SelectItem value="none">无分隔符</SelectItem>
                    <SelectItem value="array">数组格式</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={deduplicateText} disabled={!inputText.trim()}>
                去重处理
              </Button>
              <Button onClick={clearAll} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">处理结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={outputText}
              readOnly
              placeholder="处理结果将显示在这里..."
              className="min-h-[400px] resize-none bg-secondary/50"
            />
            
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} disabled={!outputText} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                复制结果
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">功能特点</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>去重功能:</strong> 自动去除重复的文本行</li>
                <li>• <strong>分隔符支持:</strong> 支持多种常见分隔符</li>
                <li>• <strong>保留顺序:</strong> 保留原始文本的顺序</li>
                <li>• <strong>批量处理:</strong> 一次处理大量文本</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用场景</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>数据清洗:</strong> 清理重复的数据记录</li>
                <li>• <strong>关键词整理:</strong> 去除重复的关键词</li>
                <li>• <strong>名单去重:</strong> 整理重复的名单列表</li>
                <li>• <strong>URL去重:</strong> 清理重复的链接列表</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>小贴士:</strong> 支持自定义分隔符，可以处理各种格式的文本数据。处理结果可以直接复制使用。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-center">
        <Button 
          onClick={handleLike}
          variant={isLiked ? "default" : "outline"}
          className={isLiked ? "text-red-500 border-red-200" : ""}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? '已点赞' : '点赞'} ({likes.toLocaleString()})
        </Button>
      </div>
    </div>
  );
};

export default TextDedup;