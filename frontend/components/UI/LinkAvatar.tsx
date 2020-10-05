import React from 'react';
import Link from 'next/link';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';

interface ILinkAvatar {
  href?: string;
  as?: string;
  isLink?: boolean;
  style?: any;
  size?: number;
  isUsername: boolean;
  src?: string;
}

const LinkAvatar: React.FC<ILinkAvatar> = ({ href = "", as = "", isLink = true, style, size, isUsername, src }) => {
  return (
    <StyledLinkAvatar isUsername={isUsername}>
        <Link href={href} as={as}>
          <a>
            <Avatar
              style={style}
              size={size}
              icon={<UserOutlined />}
              src={src}
            />
          </a>
        </Link >
    </StyledLinkAvatar>
  );
}

const StyledLinkAvatar = styled.div<{isUsername: boolean}>`
  .ant-avatar {
    position: relative;
    background-color: ${props =>
      props.isUsername ? 'lightblue' : '#87d068'};
    }
`;

export default LinkAvatar;
