import { isImageLoaded } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Loading from './Loading';

interface ILoadImage {
  size?: string;
  src?: string;
  isCircle?: boolean;
  href?: string;
  as?: string;
}

const LoadImage: React.FC<ILoadImage> = ({ size = '35', src, isCircle, href, as }) => {
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

const StyledLoadImage = styled.div<{ size?: string; isCircle?: boolean }>`
  position: relative;
  ${props => props.size && css`
    height: ${props.size}px;
    weight: ${props.size}px;
  `}
  img {
    max-height: 100%;
  }
  ${props =>
    props.isCircle &&
    css`
      border-radius: 50%;
      overflow: hidden;
    `}
`;
