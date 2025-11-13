import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Palette, 
  Sun, 
  Moon, 
  Zap,
  ArrowUpDown,
  Copy,
  RotateCcw,
  Menu,
  X,
  Heart,
  Search,
  Bookmark,
  Settings,
  Home,
  FileText,
  Globe,
  Calculator,
  Clock,
  Shuffle,
  Image,
  HelpCircle,
  Code,
  Lock,
  Wifi
} from 'lucide-react';
import { toast } from 'sonner';

// 主题类型定义
type Theme = 'light' | 'dark' | 'purple' | 'green' | 'orange';

// 工具分类数据
const toolCategories = [
  {
    id: 'text',
    name: '文本工具',
    icon: FileText,
    tools: [
      { name: '英文字母大小写转换', active: true },
      { name: '文本处理工作流工具', active: false },
      { name: '文本去重分隔工具', active: false },
      { name: '文本替换工具', active: false },
      { name: '文本反转排序工具', active: false },
      { name: '文本增加序号工具', active: false },
      { name: '文本转HTML工具', active: false },
      { name: '特殊符号大全', active: false },
      { name: 'Emoji 表情大全', active: false },
      { name: '花体英文转换器', active: false },
      { name: '字数统计工具', active: false },
      { name: '内容重复率检测', active: false },
      { name: '中英文排版纠正器', active: false },
      { name: '词频统计工具', active: false }
    ]
  },
  {
    id: 'language',
    name: '语言工具',
    icon: Globe,
    tools: [
      { name: '简体繁体转换工具', active: false },
      { name: '汉语拼音转换工具', active: false },
      { name: '粤语拼音转换工具', active: false },
      { name: '成语查询工具', active: false },
      { name: '在线翻译工具', active: false }
    ]
  },
  {
    id: 'finance',
    name: '财务工具',
    icon: Calculator,
    tools: [
      { name: '人民币大写转换器', active: false },
      { name: '支票日期大写转换器', active: false },
      { name: '英文金额大写转换器', active: false },
      { name: '税金税率计算器', active: false },
      { name: '个人所得税计算器', active: false }
    ]
  },
  {
    id: 'datetime',
    name: '日期时间',
    icon: Clock,
    tools: [
      { name: '工作日计算器', active: false },
      { name: '日期时间计算器', active: false },
      { name: '农历公历转换器', active: false },
      { name: '世界时间转换器', active: false },
      { name: '时间戳转换工具', active: false }
    ]
  },
  {
    id: 'convert',
    name: '换算工具',
    icon: Shuffle,
    tools: [
      { name: '进制转换器', active: false },
      { name: '长度单位换算器', active: false },
      { name: '面积单位换算器', active: false },
      { name: '重量单位换算器', active: false },
      { name: '体积单位换算器', active: false }
    ]
  },
  {
    id: 'image',
    name: '图像工具',
    icon: Image,
    tools: [
      { name: '图片识别文字工具', active: false },
      { name: '二维码生成器', active: false },
      { name: '二维码解码器', active: false },
      { name: '通用条形码生成器', active: false },
      { name: '图片压缩工具', active: false }
    ]
  },
  {
    id: 'query',
    name: '便民查询',
    icon: HelpCircle,
    tools: [
      { name: '手机号码归属地查询', active: false },
      { name: '常用电话列表', active: false },
      { name: '区号邮编查询工具', active: false },
      { name: '身份证所在地查询', active: false },
      { name: '全国高校信息查询', active: false }
    ]
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: Code,
    tools: [
      { name: '命名转换器', active: false },
      { name: 'JSON编辑器', active: false },
      { name: 'CSS在线格式化工具', active: false },
      { name: 'JSON代码格式化工具', active: false },
      { name: 'JavaScript代码格式化', active: false }
    ]
  },
  {
    id: 'encode',
    name: '编码解码',
    icon: Lock,
    tools: [
      { name: 'Base64编码解码工具', active: false },
      { name: 'MD5加密工具', active: false },
      { name: 'AES加密解密', active: false },
      { name: 'SHA1在线加密工具', active: false },
      { name: 'URL解码编码', active: false }
    ]
  },
  {
    id: 'network',
    name: '网络工具',
    icon: Wifi,
    tools: [
      { name: 'IP地址查询工具', active: false },
      { name: '域名whois查询', active: false },
      { name: '域名备案查询', active: false },
      { name: '微信域名拦截检测', active: false },
      { name: 'User Agent信息查看', active: false }
    ]
  }
];

// 主题配置
const themes: { name: string; value: Theme; color: string }[] = [
  { name: '浅色', value: 'light', color: '#3b82f6' },
  { name: '深色', value: 'dark', color: '#1e293b' },
  { name: '紫色', value: 'purple', color: '#8b5cf6' },
  { name: '绿色', value: 'green', color: '#10b981' },
  { name: '橙色', value: 'orange', color: '#f59e0b' }
];

export default function Index() {
  const [theme, setTheme] = useState<Theme>('light');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('text');
  const [likes, setLikes] = useState(4400);
  const [isLiked, setIsLiked] = useState(false);

  // 主题切换
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  // 获取当前日期信息
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
    
    // 计算年度进度
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const totalDays = new Date(year, 11, 31).getDate() === 31 ? 365 : 366;
    const progress = ((dayOfYear / totalDays) * 100).toFixed(2);
    
    return {
      dateStr: `${year}年${month}月${date}日`,
      day,
      progress
    };
  };

  const dateInfo = getCurrentDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* 主题切换器 */}
      <div className="theme-switcher">
        <div className="flex items-center gap-2">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme(t.value)}
              className="w-8 h-8 p-0 rounded-full"
              style={{ backgroundColor: theme === t.value ? t.color : undefined }}
            >
              {t.value === 'light' && <Sun className="w-4 h-4" />}
              {t.value === 'dark' && <Moon className="w-4 h-4" />}
              {t.value === 'purple' && <div className="w-3 h-3 rounded-full bg-purple-500" />}
              {t.value === 'green' && <div className="w-3 h-3 rounded-full bg-green-500" />}
              {t.value === 'orange' && <div className="w-3 h-3 rounded-full bg-orange-500" />}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div className={`sidebar fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo 和标题 */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                    <Type className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold category-title">易用工具</h1>
                    <p className="text-sm text-muted-foreground">便捷的在线工具</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 日期信息 */}
              <div className="mt-4 p-3 rounded-lg bg-secondary/50">
                <div className="text-sm font-medium">{dateInfo.dateStr}</div>
                <div className="text-xs text-muted-foreground">{dateInfo.day}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  2025年已过去 {dateInfo.progress}%
                </div>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索工具..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* 工具分类 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {toolCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id}>
                      <Button
                        variant={activeCategory === category.id ? "secondary" : "ghost"}
                        className="w-full justify-start mb-2"
                        onClick={() => setActiveCategory(activeCategory === category.id ? '' : category.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                      
                      {activeCategory === category.id && (
                        <div className="ml-6 space-y-1">
                          {category.tools.map((tool, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start text-sm ${
                                tool.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                              }`}
                              disabled={!tool.active}
                            >
                              {tool.name}
                              {!tool.active && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  开发中
                                </Badge>
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* 底部链接 */}
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
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* 移动端顶部栏 */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">英文字母大小写转换</h1>
            <div className="w-8" />
          </div>

          {/* 主要内容 */}
          <div className="flex-1 p-6 overflow-auto">
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
          </div>
        </div>
      </div>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}