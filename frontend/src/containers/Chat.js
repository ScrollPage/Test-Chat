import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useReactRouter from 'use-react-router'
import WebSocketInstance from '../websocket';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import styled from 'styled-components';
import ChatItem from '../components/Chat/ChatItem';
import ChatInput from '../components/Chat/ChatInput';
import ChatHeader from '../components/Chat/ChatHeader';

const Chat = () => {

  const { match } = useReactRouter();

  const username = useSelector(state => state.auth.username);
  const messages = useSelector(state => state.message.messages);

  const [message, setMessage] = useState("");

  let messagesEnd = useRef();

  const initialiseChat = () => {
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(username, match.params.chatID);
    });
    WebSocketInstance.connect(match.params.chatID);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initialiseChat();
    return () => {
      WebSocketInstance.disconnect();
    }
  }, [match.params.chatID]);

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
    const messageObject = {
      from: username,
      content: message,
      chatId: match.params.chatID
    };
    WebSocketInstance.newChatMessage(messageObject);
    setMessage("");
  }

  const scrollToBottom = () => {
    messagesEnd.scrollIntoViewIfNeeded({ behavior: "smooth" });
  }

  const renderMessages = () => {
    return messages.map((message, i, arr) => (
      <ChatItem
        key={`${message.id}__${Math.random()}`}
        name={message.author}
        time={message.timestamp}
        message={message.content}
        isUsername={message.author === username ? true : false}
      />
    ));
  }

  return (
    <StyledChat>
      <ChatHeader />
      <StyledChatInner>
        <ul>
          {messages && renderMessages(messages)}
        </ul>
      </StyledChatInner>
      <ChatInput
        sendMessage={sendMessageHandler}
        messageChange={messageChangeHandler}
        message={message}
      />
      <div style={{ float: "left", clear: "both" }}
        ref={el => messagesEnd = el}>
      </div>
    </StyledChat>
  );
}

export default Chat;

const StyledChat = styled.div`
  position: relative;
  height: auto;
  max-height: calc(100vh - 80px);
  min-height: calc(100vh - 80px);
  /* overflow-y: scroll; */
  overflow-x: hidden;
`;

const StyledChatInner = styled.div`
  /* height: 100%; */
`;