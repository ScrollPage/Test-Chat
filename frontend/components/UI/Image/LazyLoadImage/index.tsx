import React, { useState, useRef, useEffect } from 'react';
import { registerObserver } from '@/utils/intersectionObserver';
import { isImageLoaded } from '@/utils/index';

interface IImageFC {
  src: string;
  alt?: string;
  csrc: string;
}

const LazyLoadImage: React.FC<IImageFC> = ({ src, alt, csrc }) => {
  const [showImage, setShowImage] = useState(false);

  const loadImage = isImageLoaded(src);

  const placeHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerObserver(placeHolderRef.current, setShowImage);
  }, []);
  

  return (
    <div ref={placeHolderRef} >
      {showImage && loadImage ? <img src={src} alt={alt} /> : <img src={csrc} alt={alt} />}
    </div>
  );
};

export default LazyLoadImage;
