import React, { useState, useRef, useEffect } from 'react';
import { registerObserver } from '@/utils/intersectionObserver';
import { isImageLoaded } from '@/utils/index';
import { motion } from 'framer-motion';

interface IImageFC {
    src: string;
    csrc: string;
    alt?: string;
}

const LazyLoadImage: React.FC<IImageFC> = ({ src, csrc, alt }) => {
    const [showImage, setShowImage] = useState(false);

    const loadImage = isImageLoaded(src);

    const placeHolderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        registerObserver(placeHolderRef.current, setShowImage);
    }, []);

    return (
        <div ref={placeHolderRef}>
            {showImage && loadImage ? (
                <img src={src} alt={alt} />
            ) : (
                <img src={csrc} alt={alt} />
            )}
        </div>
    );
};

export default LazyLoadImage;
