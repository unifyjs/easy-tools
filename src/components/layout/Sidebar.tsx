import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Menu,
  X,
  Search,
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

// 工具分类数据
const toolCategories = [
  {
    id: 'text',
    name: '文本工具',
    icon: FileText,
    tools: [
      { name: '英文字母大小写转换', id: 'case-converter', active: true },
      { name: '文本处理工作流工具', id: 'text-workflow', active: false },
      { name: '文本去重分隔工具', id: 'text-dedup', active: true },
      { name: '文本替换工具', id: 'text-replace', active: false },
      { name: '文本反转排序工具', id: 'text-reverse', active: false },
      { name: '文本增加序号工具', id: 'text-number', active: false },
      { name: '文本转HTML工具', id: 'text-to-html', active: false },
      { name: '特殊符号大全', id: 'symbols', active: false },
      { name: 'Emoji 表情大全', id: 'emoji', active: false },
      { name: '花体英文转换器', id: 'font-changer', active: false },
      { name: '字数统计工具', id: 'word-count', active: true },
      { name: '内容重复率检测', id: 'duplicate-check', active: false },
      { name: '中英文排版纠正器', id: 'text-format', active: false },
      { name: '词频统计工具', id: 'word-frequency', active: false }
    ]
  },
  {
    id: 'language',
    name: '语言工具',
    icon: Globe,
    tools: [
      { name: '简体繁体转换工具', id: 'traditional-simplified', active: false },
      { name: '汉语拼音转换工具', id: 'pinyin', active: false },
      { name: '粤语拼音转换工具', id: 'cantonese-pinyin', active: false },
      { name: '成语查询工具', id: 'idiom', active: false },
      { name: '在线翻译工具', id: 'translate', active: false }
    ]
  },
  {
    id: 'finance',
    name: '财务工具',
    icon: Calculator,
    tools: [
      { name: '人民币大写转换器', id: 'rmb-converter', active: false },
      { name: '支票日期大写转换器', id: 'check-date', active: false },
      { name: '英文金额大写转换器', id: 'english-amount', active: false },
      { name: '税金税率计算器', id: 'tax-calculator', active: false },
      { name: '个人所得税计算器', id: 'income-tax', active: false }
    ]
  },
  {
    id: 'datetime',
    name: '日期时间',
    icon: Clock,
    tools: [
      { name: '工作日计算器', id: 'workday-calc', active: false },
      { name: '日期时间计算器', id: 'datetime-calc', active: false },
      { name: '农历公历转换器', id: 'lunar-solar', active: false },
      { name: '世界时间转换器', id: 'world-time', active: false },
      { name: '时间戳转换工具', id: 'timestamp', active: false }
    ]
  },
  {
    id: 'convert',
    name: '换算工具',
    icon: Shuffle,
    tools: [
      { name: '进制转换器', id: 'base-converter', active: false },
      { name: '长度单位换算器', id: 'length-converter', active: false },
      { name: '面积单位换算器', id: 'area-converter', active: false },
      { name: '重量单位换算器', id: 'weight-converter', active: false },
      { name: '体积单位换算器', id: 'volume-converter', active: false }
    ]
  },
  {
    id: 'image',
    name: '图像工具',
    icon: Image,
    tools: [
      { name: '图片识别文字工具', id: 'ocr', active: false },
      { name: '二维码生成器', id: 'qr-generator', active: false },
      { name: '二维码解码器', id: 'qr-decoder', active: false },
      { name: '通用条形码生成器', id: 'barcode-generator', active: false },
      { name: '图片压缩工具', id: 'image-compress', active: false }
    ]
  },
  {
    id: 'query',
    name: '便民查询',
    icon: HelpCircle,
    tools: [
      { name: '手机号码归属地查询', id: 'phone-location', active: false },
      { name: '常用电话列表', id: 'phone-list', active: false },
      { name: '区号邮编查询工具', id: 'area-code', active: false },
      { name: '身份证所在地查询', id: 'id-location', active: false },
      { name: '全国高校信息查询', id: 'university', active: false }
    ]
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: Code,
    tools: [
      { name: '命名转换器', id: 'name-converter', active: false },
      { name: 'JSON编辑器', id: 'json-editor', active: true },
      { name: 'CSS在线格式化工具', id: 'css-formatter', active: false },
      { name: 'JSON代码格式化工具', id: 'json-formatter', active: false },
      { name: 'JavaScript代码格式化', id: 'js-formatter', active: false }
    ]
  },
  {
    id: 'encode',
    name: '编码解码',
    icon: Lock,
    tools: [
      { name: 'Base64编码解码工具', id: 'base64', active: false },
      { name: 'MD5加密工具', id: 'md5', active: false },
      { name: 'AES加密解密', id: 'aes', active: false },
      { name: 'SHA1在线加密工具', id: 'sha1', active: false },
      { name: 'URL解码编码', id: 'url-encode', active: false }
    ]
  },
  {
    id: 'network',
    name: '网络工具',
    icon: Wifi,
    tools: [
      { name: 'IP地址查询工具', id: 'ip-lookup', active: false },
      { name: '域名whois查询', id: 'whois', active: false },
      { name: '域名备案查询', id: 'icp-lookup', active: false },
      { name: '微信域名拦截检测', id: 'wechat-check', active: false },
      { name: 'User Agent信息查看', id: 'user-agent', active: false }
    ]
  }
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeCategory, 
  setActiveCategory,
  activeTool,
  setActiveTool
}) => {
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
                          } ${
                            activeTool === tool.id ? 'bg-primary/20 text-primary' : ''
                          }`}
                          disabled={!tool.active}
                          onClick={() => tool.active && setActiveTool(tool.id)}
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
  );
};

export default Sidebar;