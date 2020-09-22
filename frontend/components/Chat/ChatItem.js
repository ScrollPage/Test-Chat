import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const renderTimestamp = timestamp => {
  let prefix = '';
  const timeDiff = Math.round(
    (new Date().getTime() - new Date(timestamp).getTime()) / 60000
  );
  if (timeDiff < 1) {
    prefix = 'только что...';
  } else if (timeDiff < 60 && timeDiff > 1) {
    prefix = `${timeDiff} минут назад`;
  } else if (timeDiff < 24 * 60 && timeDiff > 60) {
    prefix = `${Math.round(timeDiff / 60)} часов назад`;
  } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
    prefix = `${Math.round(timeDiff / (60 * 24))} дней назад`;
  } else {
    prefix = `${new Date(timestamp)}`;
  }
  return prefix;
};

const ChatItem = ({ name, time, message, isUsername }) => {
  return (
    <StyledChatItem isUsername={isUsername}>
      <div>
        <Avatar style={{ marginRight: '15px' }} icon={<UserOutlined />} />
      </div>
      <div className="chat-item__inner">
        <div className="chat-item__description">
          <div>{name}</div>
          <div>
            <small>{renderTimestamp(time)}</small>
          </div>
        </div>
        <div className="chat-item__message">{message}</div>
      </div>
    </StyledChatItem>
  );
};

export default ChatItem;

const StyledChatItem = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: flex-start;
  > div {
    .ant-avatar {
      background-color: ${props =>
        props.isUsername ? 'lightblue' : '#87d068'};
    }
  }
  .chat-item__inner {
    display: flex;
    flex-direction: column;
    .chat-item__description {
      display: flex;
      > div {
        &:first-of-type {
          margin-right: 10px;
        }
      }
    }
  }
`;
