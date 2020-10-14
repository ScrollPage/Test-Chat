import { isImageLoaded } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';
import React from 'react';
import Loading from '../../Loading';
import { StyledLoadImage } from './styles';

interface ILoadImage {
  size?: string;
  src?: string;
  isCircle?: boolean;
  href?: string;
  as?: string;
}

const LoadImage: React.FC<ILoadImage> = ({ size = '35', src, isCircle = true, href, as }) => {
  let loadImage: null | boolean = null;

  if (src) {
    loadImage = isImageLoaded(src);
  }

  return (
    <StyledLoadImage size={size} isCircle={isCircle}>
      {src ? (
        loadImage ? (
        href && as ? (
            <Link href={href} as={as}>
              <a>
                <img src={src} />
              </a>
            </Link>
          ) : (
            <img src={src} />
          )
        ) : (
          <Loading />
        )
      ) : (
        <Avatar
          size={Number(size)}
          shape={isCircle ? 'circle' : 'square'}
          icon={<UserOutlined />}
        />
      )}
    </StyledLoadImage>
  );
};

export default LoadImage;