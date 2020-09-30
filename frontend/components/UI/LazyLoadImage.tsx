import React, { useState, useRef, useEffect } from 'react';
import { registerObserver } from '@/utils/intersectionObserver';
import Loading from './Loading';

interface IImageFC {
  src: string;
  alt?: string;
  csrc: string;
}

const loadImageWithPromiseTimeout = (src: string) =>
    new Promise((resolve, reject) => {
      const image = new Image();

      const timeout = setTimeout(() => {
        image.onload = null;
        reject();
      }, 1000);

      image.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      image.src = src;
    });

const LazyLoadImage: React.FC<IImageFC> = ({ src, alt, csrc }) => {
  const [showImage, setShowImage] = useState(false);

  const [loadImage, setLoadImage] = useState(false);

  const placeHolderRef = useRef<HTMLDivElement>(null);

  const awaitImage = async () => {
    try {
      await loadImageWithPromiseTimeout(src);
      setLoadImage(true);
    } catch {
      console.error(`Unable to load ${src} in 1s`);
    }
  };

  useEffect(() => {
    registerObserver(placeHolderRef.current, setShowImage);
    awaitImage();
  }, []);

  return (
    <div ref={placeHolderRef}>
      {showImage && loadImage ? <img src={src} alt={alt} /> : <img src={csrc} alt={alt} /> }
    </div>
  );
};

export default LazyLoadImage;
