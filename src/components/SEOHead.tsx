import { useEffect } from 'react';
import { getToolSEO, generateStructuredData, SEOConfig } from '@/data/seoConfig';

interface SEOHeadProps {
  toolId?: string;
  customSEO?: Partial<SEOConfig>;
}

export function SEOHead({ toolId = 'home', customSEO }: SEOHeadProps) {
  useEffect(() => {
    const seo = { ...getToolSEO(toolId), ...customSEO };
    const currentUrl = window.location.href;
    
    // 设置页面标题
    document.title = seo.title;
    
    // 设置或更新meta标签
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // 基础SEO标签
    setMetaTag('description', seo.description);
    setMetaTag('keywords', seo.keywords.join(', '));
    
    // Open Graph标签
    setMetaTag('og:title', seo.ogTitle || seo.title, true);
    setMetaTag('og:description', seo.ogDescription || seo.description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:site_name', 'Easy Tools', true);
    
    // Twitter Card标签
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', seo.ogTitle || seo.title);
    setMetaTag('twitter:description', seo.ogDescription || seo.description);
    
    // 设置canonical链接
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonicalUrl || currentUrl);
    
    // 添加结构化数据
    const structuredData = generateStructuredData(toolId, currentUrl);
    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLd);
    }
    
    jsonLd.textContent = JSON.stringify(structuredData);
    
  }, [toolId, customSEO]);
  
  return null;
}

// Hook for easy SEO management
export function useSEO(toolId?: string, customSEO?: Partial<SEOConfig>) {
  useEffect(() => {
    const seo = { ...getToolSEO(toolId || 'home'), ...customSEO };
    document.title = seo.title;
  }, [toolId, customSEO]);
}