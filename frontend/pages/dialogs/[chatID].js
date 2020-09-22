import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import Cookie from 'js-cookie';

import { setLoading } from '@/store/actions/message';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import WebSocketInstance from '@/websocket';
import ChatItem from '@/components/Chat/ChatItem';
import ChatInput from '@/components/Chat/ChatInput';
import ChatHeader from '@/components/Chat/ChatHeader';
import Loading from '@/components/UI/Loading';
import PrivateLayout from '@/components/Layout/PrivateLayout';

export default function Chat() {
  const dispatch = useDispatch();

  const { messages, loading } = useSelector(state => state.message);

  const { query } = useRouter();

  const [message, setMessage] = useState('');

  let messagesEnd = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    dispatch(setLoading());
    initialiseChat();
    return () => {
      WebSocketInstance.disconnect();
    };
  }, [query.chatID]);

  const initialiseChat = () => {
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(Cookie.get('userId'), query.chatID);
    });
    WebSocketInstance.connect(query.chatID);
  };

  const waitForSocketConnection = callback => {
    setTimeout(function() {
      if (WebSocketInstance.state() === 1) {
        console.log('Connection is made');
        callback();
        return;
      } else {
        console.log('wait for connection...');
        waitForSocketConnection(callback);
      }
    }, 100);
  };

  const messageChangeHandler = e => {
    setMessage(e.target.value);
  };

  const sendMessageHandler = e => {
    e.preventDefault();
    if (message.trim() !== '') {
      const messageObject = {
        from: Cookie.get('userId'),
        content: message,
        chatId: query.chatID
      };
      WebSocketInstance.newChatMessage(messageObject);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEnd.scrollIntoViewIfNeeded({ behavior: 'smooth' });
  };

  const renderMessages = () => {
    return messages.map(message => (
      <ChatItem
        key={`${message.id}__${Math.random()}`}
        name={`${message.first_name} ${message.last_name}`}
        time={message.timestamp}
        message={message.content}
        isUsername={message.author === Cookie.get('userId')}
      />
    ));
  };

  return (
    <PrivateLayout>
      <StyledChat>
        <ChatHeader />
        <StyledChatInner>
          {loading ? (
            <Loading />
          ) : messages.length === 0 ? (
            <p className="not-messages">У вас нет сообщений</p>
          ) : renderMessages(messages)}
          <div
            style={{
              float: 'left',
              clear: 'both',
              position: 'absolute',
              bottom: '-50px',
              left: '0'
            }}
            ref={el => (messagesEnd = el)}
          />
        </StyledChatInner>
        <ChatInput
          sendMessage={sendMessageHandler}
          messageChange={messageChangeHandler}
          message={message}
        />
      </StyledChat>
    </PrivateLayout>
  );
}

const StyledChat = styled.div`
  position: relative;
  max-height: calc(100vh - 80px);
  min-height: calc(100vh - 80px);
  /* overflow-x: hidden; */
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 1em;
    background-color: #f5f5f5;
    @media (max-width: 575.98px) {
      width: 0px;
    }
  }
  &::-webkit-scrollbar-track {
    height: 90%;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #1890ff;
  }
`;

const StyledChatInner = styled.div`
  min-height: calc(100vh - 210px);
  position: relative;
  .not-messages {
    position: absolute;
    top: 50%;
    margin-top: -10.5px;
    left: 50%;
    margin-left: -67.5px;
    font-weight: 700;
    opacity: 0.7;
  }
`;
