export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
  tags?: string[];
}

export interface AIToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: AITool[];
}

export const aiToolCategories: AIToolCategory[] = [
  {
    id: 'ai-writing',
    name: 'AI写作工具',
    icon: '✍️',
    tools: [
      {
        id: 'xingyue-writing',
        name: '星月写作',
        description: '解析全网内容，秒变文本生产力',
        category: 'ai-writing',
        url: 'https://xingyueai.cn',
        tags: ['写作', '内容生成']
      },
      {
        id: 'xiaohe-omnibox',
        name: '小黑 OmniBox',
        description: '免费生成千字大纲，几万字专业初稿',
        category: 'ai-writing',
        url: 'https://omnibox.ai',
        tags: ['论文', '大纲']
      },
      {
        id: 'biling-ai',
        name: '笔灵AI论文',
        description: '答辩PPT一键生成，无限改稿',
        category: 'ai-writing',
        url: 'https://ibiling.cn',
        tags: ['论文', 'PPT']
      },
      {
        id: '66ai-paper',
        name: '66AI论文',
        description: 'AI智能标书撰写，高效生成企业方案',
        category: 'ai-writing',
        url: 'https://66ai.net',
        tags: ['论文', '标书']
      }
    ]
  },
  {
    id: 'ai-image',
    name: 'AI图像工具',
    icon: '🎨',
    tools: [
      {
        id: 'midjourney',
        name: 'Midjourney',
        description: '顶级AI绘画工具，创造惊艳的艺术作品',
        category: 'ai-image',
        url: 'https://midjourney.com',
        tags: ['绘画', '艺术']
      },
      {
        id: 'stable-diffusion',
        name: 'Stable Diffusion',
        description: '开源AI图像生成模型',
        category: 'ai-image',
        url: 'https://stability.ai',
        tags: ['开源', '图像生成']
      },
      {
        id: 'remove-bg',
        name: 'Remove.bg',
        description: '一键去背景，智能抠图工具',
        category: 'ai-image',
        url: 'https://remove.bg',
        tags: ['抠图', '背景移除']
      },
      {
        id: 'upscaler',
        name: 'AI图像放大',
        description: '无损放大图片，提升图像质量',
        category: 'ai-image',
        url: 'https://upscaler.stockphotos.com',
        tags: ['图像放大', '画质提升']
      }
    ]
  },
  {
    id: 'ai-video',
    name: 'AI视频工具',
    icon: '🎬',
    tools: [
      {
        id: 'sora',
        name: 'Sora',
        description: 'OpenAI新一代AI视频生成模型',
        category: 'ai-video',
        url: 'https://openai.com/sora',
        tags: ['视频生成', 'OpenAI']
      },
      {
        id: 'runway',
        name: 'Runway',
        description: '创新型AIGC视频工具，视频合成、绿幕抠除',
        category: 'ai-video',
        url: 'https://runwayml.com',
        tags: ['视频编辑', '特效']
      },
      {
        id: 'heygen',
        name: 'HeyGen',
        description: '专业的AI数字人视频生成工具',
        category: 'ai-video',
        url: 'https://heygen.com',
        tags: ['数字人', '视频生成']
      },
      {
        id: 'chanjing',
        name: '蝉镜',
        description: '中文数字人视频创作神器',
        category: 'ai-video',
        url: 'https://chanjing.cc',
        tags: ['数字人', '中文']
      }
    ]
  },
  {
    id: 'ai-chat',
    name: 'AI对话聊天',
    icon: '💬',
    tools: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'OpenAI开发的强大AI对话助手',
        category: 'ai-chat',
        url: 'https://chat.openai.com',
        tags: ['对话', 'OpenAI']
      },
      {
        id: 'claude',
        name: 'Claude',
        description: 'Anthropic开发的先进AI助手',
        category: 'ai-chat',
        url: 'https://claude.ai',
        tags: ['对话', 'Anthropic']
      },
      {
        id: 'kimi',
        name: 'Kimi',
        description: '月之暗面开发的超大内存AI助手',
        category: 'ai-chat',
        url: 'https://kimi.moonshot.cn',
        tags: ['对话', '长文本']
      },
      {
        id: 'tongyi',
        name: '通义千问',
        description: '阿里云开发的大语言模型',
        category: 'ai-chat',
        url: 'https://tongyi.aliyun.com',
        tags: ['对话', '阿里云']
      }
    ]
  },
  {
    id: 'ai-office',
    name: 'AI办公工具',
    icon: '📊',
    tools: [
      {
        id: 'aippt',
        name: 'AiPPT',
        description: '一键生成高质量PPT',
        category: 'ai-office',
        url: 'https://aippt.cn',
        tags: ['PPT', '演示']
      },
      {
        id: 'chatdoc',
        name: 'ChatDOC',
        description: '文档交互与辅助阅读',
        category: 'ai-office',
        url: 'https://chatdoc.com',
        tags: ['文档', '阅读']
      },
      {
        id: 'monica',
        name: 'Monica',
        description: 'AI时间跟踪与效率助手',
        category: 'ai-office',
        url: 'https://monica.im',
        tags: ['效率', '时间管理']
      }
    ]
  },
  {
    id: 'ai-audio',
    name: 'AI音频工具',
    icon: '🎵',
    tools: [
      {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        description: '文字转语音和人工智能声音生成器',
        category: 'ai-audio',
        url: 'https://elevenlabs.io',
        tags: ['语音合成', 'TTS']
      },
      {
        id: 'minimax-audio',
        name: 'MiniMax语音',
        description: 'AI语音合成与多语言配音工具',
        category: 'ai-audio',
        url: 'https://www.minimaxi.com/audio',
        tags: ['语音合成', '配音']
      },
      {
        id: 'tencent-song',
        name: '腾讯SongGeneration',
        description: '腾讯AI Lab推出并开源的音乐生成大模型',
        category: 'ai-audio',
        url: 'https://github.com/TencentARC/SongGeneration',
        tags: ['音乐生成', '腾讯']
      }
    ]
  },
  {
    id: 'ai-search',
    name: 'AI搜索引擎',
    icon: '🔍',
    tools: [
      {
        id: 'perplexity',
        name: 'Perplexity',
        description: '利用大型语言模型的AI搜索引擎',
        category: 'ai-search',
        url: 'https://perplexity.ai',
        tags: ['搜索', 'LLM']
      },
      {
        id: 'devv-ai',
        name: '开搜AI',
        description: '免费AI问答搜索引擎',
        category: 'ai-search',
        url: 'https://devv.ai',
        tags: ['搜索', '问答']
      },
      {
        id: 'metaso',
        name: '秘塔AI搜索',
        description: '深度AI搜索，无广告干扰',
        category: 'ai-search',
        url: 'https://metaso.cn',
        tags: ['搜索', '无广告']
      }
    ]
  }
];

export const getAllAITools = (): AITool[] => {
  return aiToolCategories.flatMap(category => category.tools);
};

export const getAIToolsByCategory = (categoryId: string): AITool[] => {
  const category = aiToolCategories.find(cat => cat.id === categoryId);
  return category ? category.tools : [];
};

export const searchAITools = (query: string): AITool[] => {
  const allTools = getAllAITools();
  const lowercaseQuery = query.toLowerCase();
  
  return allTools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};