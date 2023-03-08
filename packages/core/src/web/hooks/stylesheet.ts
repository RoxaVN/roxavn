import { useEffect, useState } from 'react';

export const useStylesheet = (url: string) => {
  const [loaded, setLoaded] = useState(false);

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
      link.addEventListener('load', () => setLoaded(true));

      head.appendChild(link);
    } else {
      // already add
      setLoaded(true);
    }
  }, [url]);

  return loaded;
};
