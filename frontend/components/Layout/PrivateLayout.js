import React, { useEffect } from 'react';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import WebSocketInstance from '@/websocket';

import { authCheckState } from '@/store/actions/auth';
import { setMessages, addMessage } from '@/store/actions/message';

import Header from './Header';
import Navbar from './Navbar';
import Container from '@/styles/Container';

const PrivateLayout = ({ children }) => {
  const dispatch = useDispatch();

  const setMessagesHandler = messages => {
    dispatch(setMessages(messages));
  };

  const addMessageHandler = message => {
    dispatch(addMessage(message));
  };

  useEffect(() => {
    dispatch(authCheckState());
    WebSocketInstance.addCallbacks(setMessagesHandler, addMessageHandler);
  }, []);

  return (
    <>
      <Header />
      <StyledMain>
        <Container>
          <Navbar />
          <div className="private-layout__main">{children}</div>
        </Container>
      </StyledMain>
    </>
  );
};

export default PrivateLayout;

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 60px;
  @media (max-width: 575.98px) {
    padding-top: 70px;
  }
  .private-layout__main {
    margin-left: 180px;
    @media (max-width: 575.98px) {
      margin-left: 55px;
    }
  }
`;
