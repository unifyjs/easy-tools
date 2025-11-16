import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoremGenerator = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const { toast } = useToast();

  // Lorem ipsum 词汇库
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
    'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione',
    'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci',
    'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat',
    'voluptatem', 'fuga', 'harum', 'quidem', 'rerum', 'facilis', 'expedita',
    'distinctio', 'nam', 'libero', 'tempore', 'cum', 'soluta', 'nobis', 'eligendi',
    'optio', 'cumque', 'nihil', 'impedit', 'quo', 'minus', 'maxime', 'placeat',
    'facere', 'possimus', 'omnis', 'assumenda', 'repellendus', 'temporibus',
    'autem', 'quibusdam', 'officiis', 'debitis', 'necessitatibus', 'saepe',
    'eveniet', 'voluptates', 'repudiandae', 'recusandae', 'itaque', 'earum',
    'hic', 'tenetur', 'sapiente', 'delectus', 'reiciendis', 'maiores', 'alias',
    'perferendis', 'doloribus', 'asperiores', 'repellat'
  ];

  // 生成随机单词
  const getRandomWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  // 生成句子
  const generateSentence = (minWords = 4, maxWords = 18) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    
    // 首字母大写
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    
    return words.join(' ') + '.';
  };

  // 生成段落
  const generateParagraph = (minSentences = 3, maxSentences = 7) => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  // 生成文本
  const generateText = () => {
    if (count <= 0) {
      toast({
        title: "数量无效",
        description: "请输入大于0的数量",
        variant: "destructive",
      });
      return;
    }

    let result = '';

    switch (type) {
      case 'words':
        const words = [];
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord());
        }
        if (startWithLorem && words.length > 0) {
          words[0] = 'Lorem';
          if (words.length > 1) words[1] = 'ipsum';
        }
        result = words.join(' ') + '.';
        // 首字母大写
        result = result.charAt(0).toUpperCase() + result.slice(1);
        break;

      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        if (startWithLorem && sentences.length > 0) {
          sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
        result = sentences.join(' ');
        break;

      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        if (startWithLorem && paragraphs.length > 0) {
          paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + paragraphs[0].substring(paragraphs[0].indexOf(' ') + 1);
        }
        result = paragraphs.join('\n\n');
        break;
    }

    setGeneratedText(result);
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    if (!generatedText) {
      toast({
        title: "无内容可复制",
        description: "请先生成Lorem文本",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "复制成功",
        description: "Lorem文本已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制文本",
        variant: "destructive",
      });
    }
  };

  // 清空内容
  const handleClear = () => {
    setGeneratedText('');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Type className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Lorem文本生成器</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            生成Lorem ipsum占位文本，支持按段落、句子或单词生成，适用于设计稿、网页开发等场景
          </p>
        </div>

        {/* 生成选项 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>生成选项</CardTitle>
            <CardDescription>配置要生成的Lorem文本类型和数量</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">生成类型</Label>
                <Select value={type} onValueChange={(value: 'paragraphs' | 'sentences' | 'words') => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">段落</SelectItem>
                    <SelectItem value="sentences">句子</SelectItem>
                    <SelectItem value="words">单词</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">数量</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  placeholder="输入数量"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="startWithLorem"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="startWithLorem" className="text-sm">
                以"Lorem ipsum"开头
              </Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={generateText} className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                生成文本
              </Button>
              <Button variant="outline" onClick={handleClear}>
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 生成结果 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>生成结果</CardTitle>
            <CardDescription>
              生成的Lorem ipsum文本，点击复制按钮可复制到剪贴板
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="生成的Lorem文本将显示在这里..."
              value={generatedText}
              readOnly
              className="min-h-[300px] resize-none bg-gray-50 font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制文本
              </Button>
              <div className="ml-auto text-sm text-gray-500 flex items-center">
                {generatedText && (
                  <>
                    字符数: {generatedText.length} | 
                    单词数: {generatedText.split(/\s+/).filter(word => word.length > 0).length}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lorem Ipsum 说明 */}
        <Card>
          <CardHeader>
            <CardTitle>关于Lorem Ipsum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Lorem ipsum是印刷及设计行业的标准占位文本。自16世纪起，Lorem ipsum就被广泛用作占位文本，
              它的使用可以追溯到1500年代的一位不知名的印刷工人。
            </p>
            <p className="text-gray-600">
              Lorem ipsum的文本来源于西塞罗（Cicero）在公元前45年撰写的《善恶之辨》（De Finibus Bonorum et Malorum）
              第1.10.32和1.10.33节。这段文本经过了修改，添加、删除或更改了一些字母，使其看起来不像可读的拉丁文。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">使用场景：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 网页设计和开发中的占位文本</li>
                <li>• 印刷品设计的版面布局</li>
                <li>• 软件界面的文本占位</li>
                <li>• 演示文稿和原型设计</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoremGenerator;