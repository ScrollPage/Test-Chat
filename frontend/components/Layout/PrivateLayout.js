import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Navbar from './Navbar';
import Container from '@/styles/Container';
import WebSocketInstance from '@/websocket';
import { MessageContext } from '@/context/message/MessageContext';
import { AuthContext } from '@/context/auth/AuthContext';

const PrivateLayout = ({children}) => {

  const { setMessages, addMessage } = useContext(MessageContext);

  const { authCheckState } = useContext(AuthContext);

  useEffect(() => {
    authCheckState();
    WebSocketInstance.addCallbacks(setMessages, addMessage);
  }, []);

  return (
    <>
      <Header />
      <StyledMain>
        <Container>
          <Navbar />
          <div className="private-layout__main">
            {children}
          </div>
        </Container>
      </StyledMain>
    </>
  );
}

export default PrivateLayout;

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 80px;
  @media (max-width: 575.98px) {
    padding-top: 70px;
  }
  .private-layout__main {
    margin-left: 220px;
    @media (max-width: 575.98px) {
      margin-left: 55px;
    }
  }
`;
