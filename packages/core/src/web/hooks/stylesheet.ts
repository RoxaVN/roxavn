import { useEffect } from 'react';

export const useStylesheet = (url: string) => {
  useEffect(() => {
    const head = document.head;
    if (
      ![...head.children].find(
        (node) => node.tagName === 'LINK' && 'href' in node && node.href === url
      )
    ) {
      const link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;

      head.appendChild(link);
    }
  }, [url]);
};
