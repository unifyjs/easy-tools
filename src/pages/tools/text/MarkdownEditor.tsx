import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Image,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useToast } from '@/hooks/use-toast';

// 配置marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Markdown编辑器

欢迎使用在线Markdown编辑器！

## 功能特性

- ✅ **实时预览** - 左侧编辑，右侧实时预览
- ✅ **语法高亮** - 支持代码语法高亮
- ✅ **工具栏** - 快速插入常用Markdown语法
- ✅ **导出功能** - 支持导出为HTML和Markdown文件
- ✅ **响应式设计** - 支持移动端和桌面端

## 语法示例

### 标题
\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
\`\`\`

### 文本样式
**粗体文本** 和 *斜体文本*

### 列表
- 无序列表项1
- 无序列表项2

1. 有序列表项1
2. 有序列表项2

### 链接和图片
[链接文本](https://example.com)

![图片描述](https://via.placeholder.com/300x200)

### 引用
> 这是一个引用块
> 可以包含多行内容

### 代码
行内代码：\`console.log('Hello World')\`

代码块：
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

---

开始编辑您的Markdown内容吧！`);

  const [activeTab, setActiveTab] = useState('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // 渲染HTML
  const renderHTML = () => {
    const rawHTML = marked(markdown);
    return DOMPurify.sanitize(rawHTML);
  };

  // 插入文本到光标位置
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    const newText = markdown.substring(0, start) + 
                   before + selectedText + after + 
                   markdown.substring(end);
    
    setMarkdown(newText);
    
    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 工具栏按钮配置
  const toolbarButtons = [
    { icon: Heading1, label: '一级标题', action: () => insertText('# ') },
    { icon: Heading2, label: '二级标题', action: () => insertText('## ') },
    { icon: Heading3, label: '三级标题', action: () => insertText('### ') },
    { icon: Bold, label: '粗体', action: () => insertText('**', '**') },
    { icon: Italic, label: '斜体', action: () => insertText('*', '*') },
    { icon: Link, label: '链接', action: () => insertText('[', '](url)') },
    { icon: Image, label: '图片', action: () => insertText('![', '](url)') },
    { icon: List, label: '无序列表', action: () => insertText('- ') },
    { icon: ListOrdered, label: '有序列表', action: () => insertText('1. ') },
    { icon: Quote, label: '引用', action: () => insertText('> ') },
    { icon: Code, label: '代码', action: () => insertText('`', '`') },
  ];

  // 复制内容
  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "复制成功",
        description: `${type}内容已复制到剪贴板`,
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  // 下载文件
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "下载成功",
      description: `文件 ${filename} 已开始下载`,
    });
  };

  return (
    <>
      <SEOHead toolId="markdown-editor" />
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold">Markdown编辑器</h1>
            <Badge variant="secondary">文本工具</Badge>
          </div>
          <p className="text-gray-600">在线Markdown编辑器，支持实时预览和导出功能</p>
        </div>

        {/* 工具栏 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={button.action}
                  className="flex items-center gap-1"
                >
                  <button.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{button.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 主编辑区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 编辑器 */}
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  编辑器
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(markdown, 'Markdown')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(markdown, 'document.md', 'text/markdown')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载MD
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)]">
              <Textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在这里输入您的Markdown内容..."
                className="h-full resize-none border-0 rounded-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* 预览区域 */}
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  预览
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(renderHTML(), 'HTML')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    复制HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(renderHTML(), 'document.html', 'text/html')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载HTML
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-80px)] overflow-auto">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: renderHTML() }}
              />
            </CardContent>
          </Card>
        </div>

        {/* 移动端标签页 */}
        <div className="lg:hidden mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                编辑
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                预览
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-4">
              <Card className="h-[500px]">
                <CardContent className="p-0 h-full">
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="在这里输入您的Markdown内容..."
                    className="h-full resize-none border-0 rounded-none font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <Card className="h-[500px]">
                <CardContent className="p-4 h-full overflow-auto">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: renderHTML() }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>
              Markdown编辑器的功能介绍和使用技巧
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">主要功能</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 实时预览Markdown渲染效果</li>
                  <li>• 工具栏快速插入常用语法</li>
                  <li>• 代码语法高亮显示</li>
                  <li>• 支持导出MD和HTML文件</li>
                  <li>• 响应式设计，支持移动端</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">快捷键</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Ctrl/Cmd + B: 粗体</li>
                  <li>• Ctrl/Cmd + I: 斜体</li>
                  <li>• Ctrl/Cmd + K: 插入链接</li>
                  <li>• Ctrl/Cmd + S: 保存/下载</li>
                  <li>• Tab: 增加缩进</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default MarkdownEditor;