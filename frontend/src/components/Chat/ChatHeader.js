import React from 'react';
import styled from 'styled-components';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';

const ChatHeader = () => {
  return (
    <StyledChatHeader>
      <Link to="/dialogs">
        <div className="chat-header__nav">
          <div>
            <LeftOutlined />
          </div>
          <div>Назад</div>
        </div>
      </Link>
      <div>Название</div>
      <div>
        <Avatar style={{ backgroundColor: '#87d068', marginRight: '15px' }} icon={<UserOutlined />} />
      </div>
    </StyledChatHeader>
  );
}

export default ChatHeader;

const StyledChatHeader = styled.div`
  z-index: 1;
  background: white;
  position: sticky;
  top: 0px;
  width: 100%;
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .chat-header__nav {
    width: 100%;
    cursor: pointer !important;
    height: 100%;
    display: flex;
    align-items: center;
    > div {
      &:first-of-type {
        margin-right: 20px;
      }
    }
  }
`;