import React from 'react';
import { MailOutlined, SettingOutlined, CommentOutlined, HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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

const ActiveLink = ({ children, ...props }) => {
  const router = useRouter()
  const child = React.Children.only(children)
  return (
    <Link {...props}>
      {React.cloneElement(child, { active: router.pathname === props.href })}
    </Link>
  )
}

const renderNavItems = (navitems) => {

  return (
    navitems.map(navitem => (
      <ActiveLink
        key={navitem.key}
        href={`/${navitem.key}`}
      >
        <NavLink>
          <div>{renderIcons(navitem.key)}</div>
          <div>{navitem.name}</div>
        </NavLink>
      </ActiveLink>
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

const NavLink = styled.a`
  color: ${({ active }) => active ? '#1890ff' : 'black'}; 
  display: flex;
  padding: 20px;
  opacity: 0.6;
  @media (max-width: 575.98px) {
    padding-left: 5px;
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
`;

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
`;
