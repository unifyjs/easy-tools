import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Copy, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';

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

const WordCount: React.FC = () => {
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
    const englishSymbols = (text.match(/[.,;:?!'"()\[\]{}<>]/g) || []).length;
    
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
      toast.success("内容已复制到剪贴板");
    } catch (err) {
      toast.error("复制失败，请手动复制内容");
    }
  };

  const clearAll = () => {
    setInputText('');
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      toast.success("感谢您的点赞！");
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
      toast.success("已取消点赞");
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 工具标题和统计 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center float-animation">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold category-title">字数统计工具</h1>
            <p className="text-muted-foreground">精确统计文本的字数、字符数等详细信息</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>2638次使用</span>
          </div>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            统计说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">统计规则</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>总字数:</strong> 中文字符数 + 英文单词数</li>
                <li>• <strong>总字符数(UTF-8):</strong> 所有字符的数量</li>
                <li>• <strong>总字符数(GBK):</strong> 中文字符2字节，其他1字节</li>
                <li>• <strong>总汉字数:</strong> 中文汉字字符的数量</li>
                <li>• <strong>汉字符号:</strong> 中文标点符号的数量</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">其他统计</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>外文字母:</strong> 英文字母(a-z, A-Z)的数量</li>
                <li>• <strong>外文单词:</strong> 英文单词的数量</li>
                <li>• <strong>外文符号:</strong> 英文标点符号的数量</li>
                <li>• <strong>数字:</strong> 阿拉伯数字(0-9)的数量</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>小贴士:</strong> 统计规则接近Word，支持中英文混合文本的精确统计。
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

export default WordCount;