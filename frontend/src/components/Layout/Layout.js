import React from 'react';

// Styled components
import styled, { createGlobalStyle, css } from 'styled-components';
import { normalize } from 'styled-normalize';
import { Container } from '../../styled/container';
import { useSelector } from 'react-redux';
import Header from './Header';
import Navbar from './Navbar';

const Layout = ({ children }) => {

  const isAuthenticated = useSelector(state => !!state.auth.token);

  return (
    <>
      <GlobalStyle />
      {isAuthenticated ? <Header /> : null}
      <Container>
        <StyledMain isAuthenticated={isAuthenticated}>
        {isAuthenticated ? <Navbar /> : null}
          <main>{children}</main>
        </StyledMain>
        
      </Container>
    </>
  );
}

export default Layout;

const GlobalStyle = createGlobalStyle`
  ${normalize}
  * {
    text-decoration: none;
  }
  .app {
    height: 100% !important; 
    width: 100%;
  }
  p {
    margin: 0;
  }
  html {
    box-sizing: border-box;
    /* overflow-y: scroll; */
  }
  body {
    overscroll-behavior: none;
    overflow-x: hidden;
    /* background-color: #f0d8bb; */
    &.no-scroll {
      overflow-y: hidden;
    }
  }
`;

const StyledMain = styled.div`
  padding-top: 80px;
  width: 100%;
  height: 100%;
  display: flex;
  > main {
    flex: 1;
    ${props => props.isAuthenticated && css`
      margin-left: 220px;
  `}
  }
`;


