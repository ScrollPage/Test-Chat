import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import WebSocketInstance from '../../websocket';
import { logout } from '../../store/actions/auth';
import { openAlert } from '../../store/actions/alert';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router'
import { Container } from '../../styled/container';

const Header = () => {

  const { match, history } = useReactRouter();

  const username = useSelector(state => state.auth.username);

  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    if (match.params.chatID !== undefined && match.params.chatID !== null) {
      WebSocketInstance.disconnect();
    }
    dispatch(logout());
    dispatch(openAlert('Вы успешно вышли!', 'success'));
    history.push('/');
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
            {username}
            <div className="styled-avatar__arrow">
              {menuOpen ? <UpOutlined /> : <DownOutlined />}
            </div>
            {menuOpen
              ? <StyledAvatarMenu>
                <div>
                  <Link to="/settings">
                    Настройки
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
  background: #1890ff !important;
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
      /* opacity: 0.8; */
      font-size: 18px;
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
