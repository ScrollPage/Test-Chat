import React from 'react';
import { Menu } from 'antd';
import { MailOutlined, SettingOutlined, CommentOutlined, HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useWidth from '../../hoc/useWidth';
import useReactRouter from 'use-react-router';

const navitems = [
  { key: 'my_page', name: 'Моя страница' },
  { key: 'news', name: 'Новости' },
  { key: 'dialogs', name: 'Сообщения' },
  { key: 'friends', name: 'Друзья' },
  { key: 'teams', name: 'Сообщества' },
  { key: 'settings', name: 'Настройки' }
]

const renderIcons = (key) => {
  if (key === 'my_page') return <HomeOutlined />;
  if (key === 'news') return <MailOutlined />;
  if (key === 'dialogs') return <CommentOutlined />;
  if (key === 'friends') return <UserOutlined />;
  if (key === 'teams') return <TeamOutlined />;
  if (key === 'settings') return <SettingOutlined />;
}

const renderNavItems = (navitems) => {

  const { location, match } = useReactRouter();

  return (
    navitems.map(navitem => (
      <NavLink
        key={navitem.key}
        to={`/${navitem.key}`}
        className="nav-item"
      >
        <div>{renderIcons(navitem.key)}</div>
        <div>{navitem.name}</div>
      </NavLink>
    ))
  )
}

const Navbar = () => {

  return (
    <StyledNavbar>
      {renderNavItems(navitems)}
    </StyledNavbar>
  );
}

export default Navbar;

const StyledNavbar = styled.div`
  width: 200px;
  position: fixed;
  height: 100%;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  .ant-menu {
    border: none;
  }
  @media (max-width: 575.98px) {
    width: auto;
  }
  .nav-item {
    display: flex;
    padding: 20px;
    color: black;
    opacity: 0.6;
    @media (max-width: 575.98px) {
      padding-left: 5px;
    }
    &.active {
      color: #1890ff;
    }
    > div {
      &:first-of-type {
        margin-right: 20px;
        @media (max-width: 575.98px) {
          margin: 0;
        }
      }
      &:last-of-type {
        @media (max-width: 575.98px) {
          display: none;
        }
      }
    }
  }
`;
