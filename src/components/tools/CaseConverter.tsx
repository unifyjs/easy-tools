import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Copy, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CaseConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [autoCopy, setAutoCopy] = useState(false);
  const [newTextBox, setNewTextBox] = useState(false);
  const [likes, setLikes] = useState(53072);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const convertCase = (type: string) => {
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
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => 
          c.toUpperCase()
        );
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
        result = inputText.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = inputText.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
    
    if (autoCopy && result) {
      copyToClipboard(result);
    }
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
    <Layout currentTool="英文字母大小写转换">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">英文字母大小写转换</h1>
          <p className="text-gray-600">快速转换英文字母的大小写格式，支持多种转换模式</p>
        </div>

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
                placeholder="请输入要转换的英文文本..."
                className="min-h-[200px] resize-none"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="autoCopy" 
                    checked={autoCopy}
                    onCheckedChange={(checked) => setAutoCopy(checked as boolean)}
                  />
                  <label htmlFor="autoCopy" className="text-sm text-gray-600">
                    转换自动复制结果
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="newTextBox" 
                    checked={newTextBox}
                    onCheckedChange={(checked) => setNewTextBox(checked as boolean)}
                  />
                  <label htmlFor="newTextBox" className="text-sm text-gray-600">
                    新文本框显示结果
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">转换结果</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                placeholder="转换结果将显示在这里..."
                className="min-h-[200px] resize-none bg-gray-50"
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

        {/* 转换按钮区域 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">转换操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                onClick={() => convertCase('upper')}
                disabled={!inputText}
                className="wawa-button"
              >
                全部大写
              </Button>
              <Button 
                onClick={() => convertCase('lower')}
                disabled={!inputText}
                className="wawa-button"
              >
                全部小写
              </Button>
              <Button 
                onClick={() => convertCase('title')}
                disabled={!inputText}
                className="wawa-button"
              >
                首字母大写
              </Button>
              <Button 
                onClick={() => convertCase('sentence')}
                disabled={!inputText}
                className="wawa-button"
              >
                句子首字母大写
              </Button>
              <Button 
                onClick={() => convertCase('camel')}
                disabled={!inputText}
                className="wawa-button"
              >
                驼峰命名
              </Button>
              <Button 
                onClick={() => convertCase('pascal')}
                disabled={!inputText}
                className="wawa-button"
              >
                帕斯卡命名
              </Button>
              <Button 
                onClick={() => convertCase('snake')}
                disabled={!inputText}
                className="wawa-button"
              >
                下划线命名
              </Button>
              <Button 
                onClick={() => convertCase('kebab')}
                disabled={!inputText}
                className="wawa-button"
              >
                中横线命名
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
                <strong>全部大写：</strong>将所有字母转换为大写形式
              </div>
              <div>
                <strong>全部小写：</strong>将所有字母转换为小写形式
              </div>
              <div>
                <strong>首字母大写：</strong>每个单词的首字母大写，其余小写
              </div>
              <div>
                <strong>句子首字母大写：</strong>每个句子的首字母大写
              </div>
              <div>
                <strong>驼峰命名：</strong>第一个单词小写，后续单词首字母大写，无空格
              </div>
              <div>
                <strong>帕斯卡命名：</strong>所有单词首字母大写，无空格
              </div>
              <div>
                <strong>下划线命名：</strong>单词间用下划线连接，全部小写
              </div>
              <div>
                <strong>中横线命名：</strong>单词间用中横线连接，全部小写
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

export default CaseConverter;