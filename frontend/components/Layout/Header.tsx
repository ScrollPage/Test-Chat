import React, { useState } from 'react';
import Cookie from 'js-cookie';
import Link from 'next/link';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { logout } from '@/store/actions/auth';
import Container from '@/styles/Container';
import { IUser } from '@/types/user';
import LoadImage from '../UI/LoadImage';

interface IHeader {
  user: IUser;
}

const Header: React.FC<IHeader> = ({ user }) => {
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = (): void => {
    dispatch(logout());
  };

  return (
    <StyledHeader>
      <Container>
        <StyledHeaderInner>
          <div>Scroll Chat</div>
          <StyledAvatar>
            <div className="header-avatar">
              <LoadImage
                isCircle={true}
                src={Cookie.get('smallAvatar')}
                href="/userpage/[userID]"
                as={`/userpage/${user?.userId}`}
                size={'35'}
              />
            </div>
            <p
              onClick={() => setMenuOpen(state => !state)}
            >{`${user?.firstName} ${user?.lastName}`}</p>
            <div
              className="styled-avatar__arrow"
              onClick={() => setMenuOpen(state => !state)}
            >
              {menuOpen ? <UpOutlined /> : <DownOutlined />}
            </div>
            {menuOpen ? (
              <StyledAvatarMenu>
                <div>
                  <Link href="/settings">
                    <a>Настройки</a>
                  </Link>
                </div>
                <div onClick={logoutHandler}>Выйти</div>
              </StyledAvatarMenu>
            ) : null}
          </StyledAvatar>
        </StyledHeaderInner>
      </Container>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.div`
  background: #1890ff;
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
  .header-avatar {
      margin-right: 10px;
  }
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
