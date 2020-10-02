import React from 'react';
import Link from 'next/link';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface ILinkAvatar {
  href?: string;
  as?: string;
  isLink?: boolean;
  style?: any;
  size?: number;
  isUsername: boolean;
}

const LinkAvatar: React.FC<ILinkAvatar> = ({ href = "", as = "", isLink = true, style, size, isUsername }) => {
  return (
    <StyledLinkAvatar isUsername={isUsername}>
      { isLink ? (
        <Link href={href} as={as}>
          <a>
            <Avatar
              style={style}
              size={size}
              icon={<UserOutlined />}
            />
          </a>
        </Link >) : (
          <Avatar
            style={style}
            size={size}
            icon={<UserOutlined />}
          />
        )}
    </StyledLinkAvatar>
  );
}

const StyledLinkAvatar = styled.div<{isUsername: boolean}>`
  .ant-avatar {
    background-color: ${props =>
      props.isUsername ? 'lightblue' : '#87d068'};
    }
`;

export default LinkAvatar;