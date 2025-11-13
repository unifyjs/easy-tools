import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Copy, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordCountStats {
  totalWords: number;
  totalCharsUTF8: number;
  totalCharsGBK: number;
  chineseChars: number;
  chineseSymbols: number;
  englishLetters: number;
  englishWords: number;
  englishSymbols: number;
  numbers: number;
}

const WordCount = () => {
  const [inputText, setInputText] = useState('');
  const [stats, setStats] = useState<WordCountStats>({
    totalWords: 0,
    totalCharsUTF8: 0,
    totalCharsGBK: 0,
    chineseChars: 0,
    chineseSymbols: 0,
    englishLetters: 0,
    englishWords: 0,
    englishSymbols: 0,
    numbers: 0
  });
  const [likes, setLikes] = useState(2638);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const calculateStats = (text: string): WordCountStats => {
    if (!text) {
      return {
        totalWords: 0,
        totalCharsUTF8: 0,
        totalCharsGBK: 0,
        chineseChars: 0,
        chineseSymbols: 0,
        englishLetters: 0,
        englishWords: 0,
        englishSymbols: 0,
        numbers: 0
      };
    }

    // 总字符数 UTF-8
    const totalCharsUTF8 = text.length;
    
    // 总字符数 GBK (简化计算，中文字符按2字节计算)
    let totalCharsGBK = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (/[\u4e00-\u9fff]/.test(char)) {
        totalCharsGBK += 2; // 中文字符2字节
      } else {
        totalCharsGBK += 1; // 其他字符1字节
      }
    }

    // 中文字符
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    
    // 中文符号
    const chineseSymbols = (text.match(/[，。；：？！""''（）【】《》]/g) || []).length;
    
    // 英文字母
    const englishLetters = (text.match(/[a-zA-Z]/g) || []).length;
    
    // 英文单词
    const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
    
    // 英文符号
    const englishSymbols = (text.match(/[.,;:?!"'()\[\]{}<>]/g) || []).length;
    
    // 数字
    const numbers = (text.match(/\d/g) || []).length;
    
    // 总字数 (接近Word统计规则：中文字符 + 英文单词)
    const totalWords = chineseChars + englishWords;

    return {
      totalWords,
      totalCharsUTF8,
      totalCharsGBK,
      chineseChars,
      chineseSymbols,
      englishLetters,
      englishWords,
      englishSymbols,
      numbers
    };
  };

  useEffect(() => {
    const newStats = calculateStats(inputText);
    setStats(newStats);
  }, [inputText]);

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

  const copyStats = () => {
    const statsText = `
字数统计结果：
总字数：${stats.totalWords}
总字符数(UTF-8)：${stats.totalCharsUTF8}
总字符数(GBK)：${stats.totalCharsGBK}
总汉字数：${stats.chineseChars}
汉字符号：${stats.chineseSymbols}
外文字母：${stats.englishLetters}
外文单词：${stats.englishWords}
外文符号：${stats.englishSymbols}
数字：${stats.numbers}
    `.trim();
    
    copyToClipboard(statsText);
  };

  return (
    <Layout currentTool="字数统计工具">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">字数统计工具</h1>
          <p className="text-gray-600">精确统计文本的字数、字符数等详细信息，接近Word统计规则</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区域 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">输入文本</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="请输入要统计的文本内容..."
                  className="min-h-[400px] resize-none"
                />
                <div className="mt-4 flex space-x-2">
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

          {/* 统计结果区域 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">统计结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="font-medium text-blue-800">总字数</span>
                    <span className="font-bold text-blue-600">{stats.totalWords.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">总字符数(UTF-8)</span>
                    <span className="font-medium">{stats.totalCharsUTF8.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">总字符数(GBK)</span>
                    <span className="font-medium">{stats.totalCharsGBK.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-700">总汉字数</span>
                    <span className="font-medium text-green-600">{stats.chineseChars.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">汉字符号</span>
                    <span className="font-medium">{stats.chineseSymbols.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm text-purple-700">外文字母</span>
                    <span className="font-medium text-purple-600">{stats.englishLetters.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm text-purple-700">外文单词</span>
                    <span className="font-medium text-purple-600">{stats.englishWords.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">外文符号</span>
                    <span className="font-medium">{stats.englishSymbols.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm text-yellow-700">数字</span>
                    <span className="font-medium text-yellow-600">{stats.numbers.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    onClick={copyStats}
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制统计结果
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="w-5 h-5 mr-2" />
              统计说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>总字数：</strong>接近Word统计规则，中文字符数 + 英文单词数
              </div>
              <div>
                <strong>总字符数(UTF-8)：</strong>所有字符的数量，每个字符计为1
              </div>
              <div>
                <strong>总字符数(GBK)：</strong>按GBK编码计算，中文字符2字节，其他1字节
              </div>
              <div>
                <strong>总汉字数：</strong>中文汉字字符的数量
              </div>
              <div>
                <strong>汉字符号：</strong>中文标点符号的数量
              </div>
              <div>
                <strong>外文字母：</strong>英文字母(a-z, A-Z)的数量
              </div>
              <div>
                <strong>外文单词：</strong>英文单词的数量
              </div>
              <div>
                <strong>外文符号：</strong>英文标点符号的数量
              </div>
              <div>
                <strong>数字：</strong>阿拉伯数字(0-9)的数量
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

export default WordCount;