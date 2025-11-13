import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Heart, 
  Star, 
  ArrowUp, 
  Moon, 
  Sun, 
  User, 
  MessageSquare,
  StickyNote,
  Bookmark
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTool?: string;
}

const toolCategories = [
  {
    name: '文本工具',
    tools: [
      { name: '英文字母大小写转换', path: '/case-converter', likes: 53072 },
      { name: '文本去重分隔工具', path: '/text-dedup', likes: 2139 },
      { name: '文本替换工具', path: '/text-replace', likes: 1734 },
      { name: '字数统计工具', path: '/word-count', likes: 2638 },
      { name: '文本反转排序工具', path: '/text-reverse', likes: 309 },
      { name: '文本增加序号工具', path: '/text-number', likes: 367 },
      { name: '文本转HTML工具', path: '/text-to-html', likes: 274 },
      { name: '中英文排版纠正器', path: '/text-format', likes: 136 },
      { name: '特殊符号大全', path: '/symbols', likes: 1848 },
      { name: '花体英文转换器', path: '/font-changer', likes: 14600 },
      { name: 'Emoji表情大全', path: '/emoji', likes: 733 },
      { name: '内容重复率检测', path: '/duplicate-check', likes: 572 },
      { name: '文本处理工作流工具', path: '/text-workflow', likes: 256 }
    ]
  },
  {
    name: '语言工具',
    tools: [
      { name: '简体繁体转换工具', path: '/traditional-simplified', likes: 1205 },
      { name: '汉语拼音转换工具', path: '/pinyin', likes: 892 },
      { name: '中文转Unicode编码', path: '/unicode', likes: 456 }
    ]
  },
  {
    name: '财务工具',
    tools: [
      { name: '人民币大写转换器', path: '/rmb-converter', likes: 3421 },
      { name: '税金税率计算器', path: '/tax-calculator', likes: 1876 },
      { name: '个人所得税计算器', path: '/income-tax', likes: 2134 }
    ]
  },
  {
    name: '日期时间',
    tools: [
      { name: '工作日计算器', path: '/workday-calc', likes: 1543 },
      { name: '日期时间计算器', path: '/datetime-calc', likes: 2876 },
      { name: '时间戳转换工具', path: '/timestamp', likes: 3421 }
    ]
  },
  {
    name: '换算工具',
    tools: [
      { name: '进制转换器', path: '/base-converter', likes: 1876 },
      { name: '长度单位换算器', path: '/length-converter', likes: 987 },
      { name: '重量单位换算器', path: '/weight-converter', likes: 654 }
    ]
  },
  {
    name: '图像工具',
    tools: [
      { name: '图片识别文字工具', path: '/ocr', likes: 5432 },
      { name: '二维码生成器', path: '/qr-generator', likes: 3210 },
      { name: '图片压缩工具', path: '/image-compress', likes: 2876 }
    ]
  },
  {
    name: '便民查询',
    tools: [
      { name: '手机号码归属地查询', path: '/phone-location', likes: 4321 },
      { name: '身份证所在地查询', path: '/id-location', likes: 3456 },
      { name: 'IP地址查询工具', path: '/ip-lookup', likes: 2109 }
    ]
  },
  {
    name: '开发工具',
    tools: [
      { name: 'JSON编辑器', path: '/json-editor', likes: 6543 },
      { name: 'CSS在线格式化工具', path: '/css-formatter', likes: 2345 },
      { name: 'HTML格式化工具', path: '/html-formatter', likes: 1987 }
    ]
  },
  {
    name: '编码解码',
    tools: [
      { name: 'Base64编码解码工具', path: '/base64', likes: 4567 },
      { name: 'URL解码编码', path: '/url-encode', likes: 3210 },
      { name: 'MD5加密工具', path: '/md5', likes: 2876 }
    ]
  },
  {
    name: '网络工具',
    tools: [
      { name: 'Ping网络测试', path: '/ping', likes: 1876 },
      { name: '域名whois查询', path: '/whois', likes: 1234 },
      { name: '网站状态检测', path: '/website-status', likes: 987 }
    ]
  }
];

const Layout: React.FC<LayoutProps> = ({ children, currentTool }) => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return now.toLocaleDateString('zh-CN', options);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex">
        {/* 左侧导航栏 */}
        <div className="w-64 sidebar-nav fixed left-0 top-0 h-full z-10">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-green-600">易用工具</h2>
            <p className="text-xs text-gray-500 mt-1">{getCurrentDate()}</p>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="nav-category">
                  {category.name}
                </div>
                <div>
                  {category.tools.map((tool, toolIndex) => (
                    <a
                      key={toolIndex}
                      href={tool.path}
                      className={`nav-item ${currentTool === tool.name ? 'active' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{tool.name}</span>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {tool.likes.toLocaleString()}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 ml-64">
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </div>

        {/* 右侧辅助功能栏 */}
        <div className="w-64 bg-white border-l border-gray-200 fixed right-0 top-0 h-full z-10">
          <div className="p-4 space-y-4">
            {/* 便签 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                <StickyNote className="w-4 h-4 mr-1" />
                便签
              </h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="记录一些想法..."
                className="w-full h-20 text-xs bg-transparent border-none resize-none focus:outline-none"
              />
              <p className="text-xs text-yellow-600 mt-1">修改内容自动保存到浏览器本地储存</p>
            </div>

            {/* 搜索工具 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-1" />
                搜索工具
              </h3>
              <Input
                type="text"
                placeholder="搜索工具名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* 收藏夹 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
                <Bookmark className="w-4 h-4 mr-1" />
                收藏夹
              </h3>
              <p className="text-xs text-purple-600">暂无收藏的工具</p>
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                查看全部收藏
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 浮动按钮 */}
      <div className="fixed right-4 bottom-4 space-y-2 z-20">
        <Button
          onClick={scrollToTop}
          size="sm"
          className="w-10 h-10 rounded-full shadow-lg"
          title="返回顶部"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => setIsDark(!isDark)}
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full shadow-lg"
          title="切换主题"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full shadow-lg"
          title="会员中心"
        >
          <User className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full shadow-lg"
          title="建议反馈"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      {/* 底部版权信息 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 ml-64 mr-64">
        <div className="text-center text-xs text-gray-500">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="/about" className="hover:text-gray-700">关于</a>
            <a href="/donate" className="hover:text-gray-700">赞赏</a>
            <a href="/feedback" className="hover:text-gray-700">反馈</a>
            <a href="/member" className="hover:text-gray-700">会员</a>
            <a href="/stall" className="hover:text-gray-700">摆个摊</a>
            <a href="/articles" className="hover:text-gray-700">文章</a>
          </div>
          <p>Copyright © 2025 易用工具 版权所有</p>
          <p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
              粤ICP备18006158号
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;