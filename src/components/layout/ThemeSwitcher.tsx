import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'purple' | 'green' | 'orange';

// 主题配置
const themes: { name: string; value: Theme; color: string }[] = [
  { name: '浅色', value: 'light', color: '#3b82f6' },
  { name: '深色', value: 'dark', color: '#1e293b' },
  { name: '紫色', value: 'purple', color: '#8b5cf6' },
  { name: '绿色', value: 'green', color: '#10b981' },
  { name: '橙色', value: 'orange', color: '#f59e0b' }
];

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
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
  );
};

export default ThemeSwitcher;