import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';
import Container from '@/styles/Container';
import { AuthContext } from '@/context/auth/AuthContext';
import Search from '@/components/UI/Search';
import Cookie from 'js-cookie';

const Header = () => {

  const { logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
  }
  
  return (
    <StyledHeader>
      <Container>
        <StyledHeaderInner>
          <div>
            Scroll Chat
          </div>
          <StyledAvatar
            onClick={() => setMenuOpen(state => !state)}
          >
            <Avatar style={{ backgroundColor: 'lightblue', marginRight: '15px' }} icon={<UserOutlined />} />
            <p>{`${Cookie.get('firstName')} ${Cookie.get('lastName')}`}</p>
            <div className="styled-avatar__arrow">
              {menuOpen ? <UpOutlined /> : <DownOutlined />}
            </div>
            {menuOpen
              ? <StyledAvatarMenu>
                <div>
                  <Link href="/settings">
                    <a>
                      Настройки
                    </a>
                  </Link>
                </div>
                <div onClick={logoutHandler}>
                  Выйти
                </div>
              </StyledAvatarMenu>
              : null}
          </StyledAvatar>
        </StyledHeaderInner>
      </Container>
    </StyledHeader>
  );
}

export default Header;

const StyledHeader = styled.div`
  background: #1890ff;
  /* background: purple; */
  z-index: 2;
  position: fixed;
  width: 100%;
`;

const StyledHeaderInner = styled.div`
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    &:first-of-type {
      font-weight: 900;
      font-size: 18px;
      display: flex;
      flex: 1;
    }
  }
  .styled-avatar__arrow {
    margin-top: 3px;
    margin-left: 10px;
    display: inline-block;
  }
`;

const StyledAvatar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer !important;
  @media (max-width: 500px) {
    p {
      display: none;
    }
  }
  p {
    margin-bottom: 0px;
  }
`;

const StyledAvatarMenu = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #f0f0f0;
  right: 0;
  bottom: -78px;
  display: flex;
  flex-direction: column;
  > div {
    padding: 10px 15px;
    &:first-of-type {
      margin-bottom: 0px;
    }
    &:last-of-type {
      color: black;
    }
  }
`;
