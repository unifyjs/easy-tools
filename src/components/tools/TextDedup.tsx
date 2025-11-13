import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Copy, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextDedup = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputSeparator, setInputSeparator] = useState('newline');
  const [outputSeparator, setOutputSeparator] = useState('newline');
  const [likes, setLikes] = useState(2139);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

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

  const separatorNames: { [key: string]: string } = {
    'newline': '换行[↵]',
    'space': '空格[ ]',
    'comma': '逗号[,]',
    'comma-cn': '中文逗号[，]',
    'slash': '斜杠[/]',
    'semicolon': '分号[;]',
    'semicolon-cn': '中文分号[；]',
    'dot': '圆点[.]',
    'none': '无分隔',
    'array': "'项目',"
  };

  const deduplicateText = () => {
    if (!inputText.trim()) {
      toast({
        title: "提示",
        description: "请输入要去重的文本",
        variant: "destructive",
      });
      return;
    }

    const separator = separatorMap[inputSeparator];
    const items = inputText.split(separator).map(item => item.trim()).filter(item => item);
    
    // 去重
    const uniqueItems = [...new Set(items)];
    
    // 根据输出分隔符格式化
    let result = '';
    const outputSep = separatorMap[outputSeparator];
    
    if (outputSeparator === 'array') {
      result = uniqueItems.map(item => `'${item}',`).join('\n');
    } else if (outputSeparator === 'none') {
      result = uniqueItems.join('');
    } else {
      result = uniqueItems.join(outputSep);
    }
    
    setOutputText(result);
    
    toast({
      title: "去重完成",
      description: `原有 ${items.length} 项，去重后 ${uniqueItems.length} 项`,
    });
  };

  const changeSeparatorOnly = () => {
    if (!inputText.trim()) {
      toast({
        title: "提示",
        description: "请输入要处理的文本",
        variant: "destructive",
      });
      return;
    }

    const separator = separatorMap[inputSeparator];
    const items = inputText.split(separator).map(item => item.trim()).filter(item => item);
    
    // 仅修改分隔符，不去重
    let result = '';
    const outputSep = separatorMap[outputSeparator];
    
    if (outputSeparator === 'array') {
      result = items.map(item => `'${item}',`).join('\n');
    } else if (outputSeparator === 'none') {
      result = items.join('');
    } else {
      result = items.join(outputSep);
    }
    
    setOutputText(result);
    
    toast({
      title: "分隔符修改完成",
      description: `共处理 ${items.length} 项`,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制内容",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      toast({
        title: "点赞成功",
        description: "感谢您的支持！",
      });
    }
  };

  return (
    <Layout currentTool="文本去重分隔工具">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">文本去重分隔工具</h1>
          <p className="text-gray-600">去除重复文本并自定义分隔符，适用于SEO关键词去重等场景</p>
        </div>

        {/* 分隔符设置 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">分隔符设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入分隔符
                </label>
                <Select value={inputSeparator} onValueChange={setInputSeparator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(separatorNames).slice(0, 7).map(([key, name]) => (
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输出分隔符
                </label>
                <Select value={outputSeparator} onValueChange={setOutputSeparator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(separatorNames).map(([key, name]) => (
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">输入文本</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`请输入要处理的文本，使用${separatorNames[inputSeparator]}分隔...`}
                className="min-h-[300px] resize-none"
              />
              <div className="mt-4 text-sm text-gray-500">
                当前分隔符：{separatorNames[inputSeparator]}
              </div>
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">处理结果</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                placeholder="处理结果将显示在这里..."
                className="min-h-[300px] resize-none bg-gray-50"
              />
              <div className="mt-4 flex space-x-2">
                <Button 
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制结果
                </Button>
                <Button 
                  onClick={clearAll}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={deduplicateText}
                disabled={!inputText}
                className="wawa-button"
              >
                文本去重
              </Button>
              <Button 
                onClick={changeSeparatorOnly}
                disabled={!inputText}
                className="wawa-button"
              >
                仅修改分隔符
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="w-5 h-5 mr-2" />
              使用说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>文本去重：</strong>去除重复的文本项目，保留唯一值
              </div>
              <div>
                <strong>仅修改分隔符：</strong>不去重，只改变文本项目之间的分隔符
              </div>
              <div>
                <strong>输入分隔符：</strong>指定原文本中项目之间的分隔符
              </div>
              <div>
                <strong>输出分隔符：</strong>指定处理后文本中项目之间的分隔符
              </div>
              <div>
                <strong>数组格式：</strong>输出格式为 'item1', 'item2', 适用于编程场景
              </div>
              <div>
                <strong>应用场景：</strong>SEO关键词去重、数据清理、列表处理等
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 示例 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">示例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-medium text-gray-700 mb-1">输入示例（换行分隔）：</div>
                <div className="bg-gray-100 p-2 rounded font-mono">
                  苹果<br/>
                  香蕉<br/>
                  苹果<br/>
                  橙子<br/>
                  香蕉
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">输出示例（逗号分隔，已去重）：</div>
                <div className="bg-gray-100 p-2 rounded font-mono">
                  苹果,香蕉,橙子
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 点赞和收藏 */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button 
            onClick={handleLike}
            variant={isLiked ? "default" : "outline"}
            className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            点赞 ({likes.toLocaleString()})
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            收藏
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TextDedup;