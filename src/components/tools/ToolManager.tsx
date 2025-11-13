import React from 'react';
import CaseConverterTool from './CaseConverter';
import JsonEditor from './JsonEditor';
import TextDedup from './TextDedup';
import WordCount from './WordCount';

// 工具组件映射
export const toolComponents: { [key: string]: React.FC } = {
  'case-converter': CaseConverterTool,
  'json-editor': JsonEditor,
  'text-dedup': TextDedup,
  'word-count': WordCount,
};

// 工具信息映射
export const toolInfo: { [key: string]: { name: string; category: string; description: string } } = {
  'case-converter': {
    name: '英文字母大小写转换',
    category: 'text',
    description: '支持多种大小写转换格式'
  },
  'json-editor': {
    name: 'JSON编辑器',
    category: 'dev',
    description: 'JSON格式化、压缩和验证工具'
  },
  'text-dedup': {
    name: '文本去重分隔工具',
    category: 'text',
    description: '去除重复文本并按指定分隔符分隔'
  },
  'word-count': {
    name: '字数统计工具',
    category: 'text',
    description: '统计文本中的字数、字符数等信息'
  }
};

// 根据工具ID获取工具组件
export const getToolComponent = (toolId: string) => {
  return toolComponents[toolId] || null;
};

// 根据工具ID获取工具信息
export const getToolInfo = (toolId: string) => {
  return toolInfo[toolId] || null;
};