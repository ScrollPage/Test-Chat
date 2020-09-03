import { useState, useEffect, useRef, useContext } from 'react';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import styled from 'styled-components';
import ChatItem from '@/components/Chat/ChatItem';
import ChatInput from '@/components/Chat/ChatInput';
import ChatHeader from '@/components/Chat/ChatHeader';
import WebSocketInstance from '@/websocket';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/auth/AuthContext';
import { MessageContext } from '@/context/message/MessageContext';
import Loading from '@/components/UI/Loading';

export default function Chat() {

  const { query } = useRouter();

  const { userId } = useContext(AuthContext);
  const { messages, loading, setLoading} = useContext(MessageContext);

  const [message, setMessage] = useState("");

  let messagesEnd = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setLoading();
    initialiseChat();
    return () => {
      WebSocketInstance.disconnect();
    }
  }, [query.chatID]);

  const initialiseChat = () => {
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(userId, query.chatID);
    });
    WebSocketInstance.connect(query.chatID);
  }

  const waitForSocketConnection = (callback) => {
    setTimeout(
      function () {
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          waitForSocketConnection(callback);
        }
      }, 100);
  }

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
  }

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const messageObject = {
        from: userId,
        content: message,
        chatId: query.chatID
      };
      WebSocketInstance.newChatMessage(messageObject);
      setMessage("");
    }
  }

  const scrollToBottom = () => {
    messagesEnd.scrollIntoViewIfNeeded({ behavior: "smooth" });
  }

  const renderMessages = () => {
    return messages.map(message => (
      <ChatItem
        key={`${message.id}__${Math.random()}`}
        name={`${message.first_name} ${message.last_name}`}
        time={message.timestamp}
        message={message.content}
        isUsername={message.author === userId ? true : false}
      />
    ));
  }

  return (
    <PrivateLayout>
      <StyledChat>
        <ChatHeader />
        <StyledChatInner>
          {loading
            ? <Loading />
            : messages.length === 0
            ? <p className="not-messages">У вас нет сообщений</p>
            : renderMessages(messages)
          }
          <div style={{ float: "left", clear: "both", position: "absolute", bottom: '-50px', left: '0' }}
            ref={el => messagesEnd = el}>
          </div>
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
    background-color: #F5F5F5;
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