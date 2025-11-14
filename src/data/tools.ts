export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'endecode-tools',
    name: '编码解码',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-blue-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 13L4 25.4322L16 37" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 13L44 25.4322L32 37" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 4L21 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    tools: [
      {
        id: 'base64-encoder',
        name: 'Base64编解码',
        description: 'Base64编码和解码工具，支持文本和文件',
        category: 'code-tools',
        icon: ''
      },
      {
        id: 'url-encoder',
        name: 'URL编解码',
        description: 'URL编码和解码工具，处理特殊字符',
        category: 'code-tools',
        icon: ''
      }
    ]
  },
  {
    id: 'code-tools',
    name: '代码工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-blue-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 13L4 25.4322L16 37" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 13L44 25.4322L32 37" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 4L21 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    tools: [
      {
        id: 'code-formatter',
        name: '代码格式化',
        description: '格式化JavaScript、CSS、HTML等代码，提高可读性',
        category: 'code-tools',
        icon: ''
      },
      {
        id: 'json-viewer',
        name: 'JSON查看器',
        description: '美化和验证JSON数据，支持树形结构显示',
        category: 'code-tools',
        icon: ''
      },
    ]
  },
  {
    id: 'text-tools',
    name: '文本工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-orange-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7H16C20.4183 7 24 10.5817 24 15V42C24 38.6863 21.3137 36 18 36H5V7Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="bevel"></path><path d="M43 7H32C27.5817 7 24 10.5817 24 15V42C24 38.6863 26.6863 36 30 36H43V7Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="bevel"></path></svg>',
    tools: [
      {
        id: 'text-formatter',
        name: '文本格式化',
        description: '格式化和美化各种文本内容，支持JSON、XML、HTML等格式',
        category: 'text-tools',
        icon: ''
      },
      {
        id: 'markdown-editor',
        name: 'Markdown编辑器',
        description: '在线Markdown编辑器，支持实时预览和导出',
        category: 'text-tools',
        icon: ''
      },
      {
        id: 'text-diff',
        name: '文本对比',
        description: '比较两个文本的差异，高亮显示不同之处',
        category: 'text-tools',
        icon: ''
      },
      {
        id: 'regex-tester',
        name: '正则表达式测试',
        description: '测试和验证正则表达式，支持多种编程语言',
        category: 'text-tools',
        icon: ''
      }
    ]
  },
  {
    id: 'conversion-tools',
    name: '转换工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-green-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M33 15L24 24L15 15" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 33L24 24L15 33" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tools: [
      {
        id: 'unit-converter',
        name: '单位转换',
        description: '长度、重量、温度等各种单位之间的转换',
        category: 'conversion-tools',
        icon: ''
      },
      {
        id: 'color-converter',
        name: '颜色转换',
        description: 'RGB、HEX、HSL等颜色格式之间的转换',
        category: 'conversion-tools',
        icon: ''
      },
      {
        id: 'timestamp-converter',
        name: '时间戳转换',
        description: '时间戳与日期时间之间的相互转换',
        category: 'conversion-tools',
        icon: ''
      },
      {
        id: 'number-base-converter',
        name: '进制转换',
        description: '二进制、八进制、十进制、十六进制之间的转换',
        category: 'conversion-tools',
        icon: ''
      }
    ]
  },
  {
    id: 'generator-tools',
    name: '生成工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-yellow-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0605 4L35.5 16L24.5 16L28.5 28L13 16L23.5 16L24.0605 4Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>',
    tools: [
      {
        id: 'qr-generator',
        name: '二维码生成',
        description: '生成各种类型的二维码，支持自定义样式',
        category: 'generator-tools',
        icon: ''
      },
      {
        id: 'password-generator',
        name: '密码生成器',
        description: '生成安全的随机密码，可自定义长度和字符集',
        category: 'generator-tools',
        icon: ''
      },
      {
        id: 'uuid-generator',
        name: 'UUID生成器',
        description: '生成各种版本的UUID/GUID',
        category: 'generator-tools',
        icon: ''
      },
      {
        id: 'lorem-generator',
        name: 'Lorem文本生成',
        description: '生成Lorem ipsum占位文本',
        category: 'generator-tools',
        icon: ''
      }
    ]
  },
  {
    id: 'image-tools',
    name: '图像工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-purple-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M42 32L32 22L12 42" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tools: [
      {
        id: 'image-compressor',
        name: '图片压缩',
        description: '压缩图片文件大小，保持质量',
        category: 'image-tools',
        icon: ''
      },
      {
        id: 'image-converter',
        name: '图片格式转换',
        description: '转换图片格式：JPG、PNG、WebP等',
        category: 'image-tools',
        icon: ''
      },
      {
        id: 'image-resizer',
        name: '图片尺寸调整',
        description: '调整图片尺寸和分辨率',
        category: 'image-tools',
        icon: ''
      },
      {
        id: 'image-cropper',
        name: '图片裁剪',
        description: '裁剪和编辑图片',
        category: 'image-tools',
        icon: ''
      }
    ]
  },
  {
    id: 'network-tools',
    name: '网络工具',
    icon: '<svg width="18" height="18" viewBox="0 0 48 48" class="text-cyan-400 size-5" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4"/><path d="M4 24H44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M24 4C24 4 32 12 32 24C32 36 24 44 24 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M24 4C24 4 16 12 16 24C16 36 24 44 24 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    tools: [
      {
        id: 'ip-lookup',
        name: 'IP地址查询',
        description: '查询IP地址的地理位置和相关信息',
        category: 'network-tools',
        icon: ''
      },
      {
        id: 'dns-lookup',
        name: 'DNS查询',
        description: '查询域名的DNS记录信息',
        category: 'network-tools',
        icon: '🔍'
      },
      {
        id: 'port-scanner',
        name: '端口扫描',
        description: '扫描主机的开放端口',
        category: 'network-tools',
        icon: '🔎'
      },
      {
        id: 'whois-lookup',
        name: 'Whois查询',
        description: '查询域名的注册信息',
        category: 'network-tools',
        icon: '📋'
      }
    ]
  }
];

export const getAllTools = (): Tool[] => {
  return toolCategories.flatMap(category => category.tools);
};

export const getToolsByCategory = (categoryId: string): Tool[] => {
  const category = toolCategories.find(cat => cat.id === categoryId);
  return category ? category.tools : [];
};