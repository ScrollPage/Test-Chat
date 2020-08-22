import React from 'react';
import { Menu } from 'antd';
import { MailOutlined, SettingOutlined, CommentOutlined, HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
  return (
    navitems.map(navitem => (
      <Menu.Item
        key={navitem.key}
        icon={renderIcons(navitem.key)}
      >
        <Link to={`/${navitem.key}`}>
          {navitem.name}
        </Link>
      </Menu.Item>
    ))
  )
}

const Navbar = () => {
  return (
    <StyledNavbar>
      <Menu
        style={{ width: '100%' }}
        defaultSelectedKeys={['dialogs']}
        mode="inline"
      >
        {renderNavItems(navitems)}
      </Menu>
    </StyledNavbar>
  );
}

export default Navbar;

const StyledNavbar = styled.div`
  width: 200px;
  position: fixed;
  height: 100%;
  border-right: 1px solid #f0f0f0;
  .ant-menu {
    border: none;
  }
`;
