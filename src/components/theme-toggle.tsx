import React from 'react';
import { Check, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme, type Theme } from '@/contexts/theme-context';

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          选择主题
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(themes).map(([key, themeData]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{themeData.icon}</span>
              <span>{themeData.displayName}</span>
            </div>
            {theme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemePreview() {
  const { themes } = useTheme();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
      {Object.entries(themes).map(([key, themeData]) => (
        <div
          key={key}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="text-2xl">{themeData.icon}</div>
          <div className="text-sm font-medium text-center">{themeData.displayName}</div>
          <div className="flex gap-1">
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: `hsl(${themeData.colors.primary})` }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: `hsl(${themeData.colors.secondary})` }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: `hsl(${themeData.colors.accent})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}