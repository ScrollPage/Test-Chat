import React from 'react';
import {
  MailOutlined,
  SettingOutlined,
  CommentOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SearchOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const navitems = [
  { key: 'news', name: 'Новости' },
  { key: 'dialogs', name: 'Сообщения' },
  { key: 'friends', name: 'Друзья' },
  { key: 'teams', name: 'Сообщества' },
  { key: 'settings', name: 'Настройки' }
];

const renderIcons = key => {
  if (key === 'news') return <MailOutlined />;
  if (key === 'dialogs') return <CommentOutlined />;
  if (key === 'friends') return <UserOutlined />;
  if (key === 'teams') return <TeamOutlined />;
  if (key === 'settings') return <SettingOutlined />;
};

const ActiveLink = ({ children, ...props }) => {
  const router = useRouter();
  const child = React.Children.only(children);
  return (
    <Link {...props}>
      {React.cloneElement(child, { active: router.pathname === props.href })}
    </Link>
  );
};

const renderNavItems = navitems => {
  return (
    <>
      <ActiveLink key="global-search" href="/global-search">
        <NavLink>
          <div>
            <SearchOutlined />
          </div>
          <div>Новые друзья...</div>
        </NavLink>
      </ActiveLink>
      <ActiveLink
        key="my_page"
        href="/userpage/[userID]"
        as={`/userpage/${Cookie.get('userId')}`}
      >
        <NavLink>
          <div>
            <HomeOutlined />
          </div>
          <div>Моя страница</div>
        </NavLink>
      </ActiveLink>
      {navitems.map(navitem => (
        <ActiveLink key={navitem.key} href={`/${navitem.key}`}>
          <NavLink>
            <div>{renderIcons(navitem.key)}</div>
            <div>{navitem.name}</div>
          </NavLink>
        </ActiveLink>
      ))}
    </>
  );
};

const Navbar = () => {
  return <StyledNavbar>{renderNavItems(navitems)}</StyledNavbar>;
};

export default Navbar;

const NavLink = styled.a`
  color: ${({ active }) => (active ? '#1890ff' : 'black')};
  display: flex;
  padding: 20px 20px 20px 0;
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
  width: 160px;
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
