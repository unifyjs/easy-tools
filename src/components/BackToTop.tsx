import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackToTopProps {
  /** 滚动容器的选择器，默认为 window */
  scrollContainer?: string;
  /** 显示按钮的滚动阈值，默认为 300px */
  threshold?: number;
  /** 按钮的位置，默认为右下角 */
  position?: 'bottom-right' | 'bottom-left';
  /** 自定义样式类名 */
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({
  scrollContainer,
  threshold = 300,
  position = 'bottom-right',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let targetElement: Element | Window;
    
    if (scrollContainer) {
      const element = document.querySelector(scrollContainer);
      if (!element) {
        console.warn(`BackToTop: 找不到滚动容器 "${scrollContainer}"`);
        return;
      }
      targetElement = element;
    } else {
      targetElement = window;
    }

    const toggleVisibility = () => {
      let scrollTop: number;
      
      if (targetElement === window) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      } else {
        scrollTop = (targetElement as Element).scrollTop;
      }
      
      setIsVisible(scrollTop > threshold);
    };

    const handleScroll = () => {
      toggleVisibility();
    };

    targetElement.addEventListener('scroll', handleScroll);
    
    // 初始检查
    toggleVisibility();

    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainer, threshold]);

  const scrollToTop = () => {
    let targetElement: Element | Window;
    
    if (scrollContainer) {
      const element = document.querySelector(scrollContainer);
      if (!element) return;
      targetElement = element;
    } else {
      targetElement = window;
    }

    if (targetElement === window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      (targetElement as Element).scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`
        fixed z-50 w-12 h-12 rounded-full
        text-white
        back-to-top-button
        ${positionClasses[position]}
        ${className}
      `}
      aria-label="回到顶部"
    >
      <Rocket className="w-25 h-25 -rotate-45" />
    </Button>
  );
};

export default BackToTop;