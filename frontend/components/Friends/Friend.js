import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const Friend = ({ slug, name }) => {
  return (
    <Link href='' as={''}>
      <a>
        <StyledFriend>
          <div>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          </div>
          <div>
            {name}
          </div>
        </StyledFriend>
      </a>
    </Link>
  );
}

export default Friend;

const StyledFriend = styled.div`
  height: 60px; 
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
