import { UserOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';
import React from 'react';
import { StyledLinkImage } from './styles';

interface ILinkImage {
  size?: string;
  src?: string;
  isCircle?: boolean;
  href?: string;
  as?: string;
}

const LinkImage: React.FC<ILinkImage> = ({ size = '35', src, isCircle = true, href, as }) => {
  return (
    <StyledLinkImage size={size} isCircle={isCircle}>
      {src ? (
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
        <Avatar
          size={Number(size)}
          shape={isCircle ? 'circle' : 'square'}
          icon={<UserOutlined />}
        />
      )}
    </StyledLinkImage>
  );
};

export default LinkImage;
