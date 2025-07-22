"use client"
import { useEffect } from 'react';
const PageLoader = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.querySelector('.page-loader') as HTMLElement | null;
      if (loader) {
        loader.style.transition = 'opacity 0.5s';
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default PageLoader;
