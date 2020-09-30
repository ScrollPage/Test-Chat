import { MutableRefObject } from 'react';

export const registerObserver = (ref: HTMLSpanElement | null, setShowImage: (bool: boolean) => void) => {
  const observer = new IntersectionObserver((enteries, observer) => {
    enteries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      setShowImage(true);
      observer.disconnect();
    });
  });
  if (ref) {
    observer.observe(ref);
  }
};
