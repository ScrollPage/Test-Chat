import React from 'react';
import {
    MailOutlined,
    SettingOutlined,
    CommentOutlined,
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IUser } from '@/types/user';
import { StyledNavbar, NavLink } from './styles';

interface INavItem {
    key: string;
    name: string;
    as?: string;
}

interface INavbar {
    user: IUser;
}

const renderIcons = (key: string) => {
    if (key === 'global-search') return <SearchOutlined />;
    if (key === 'userpage/[userID]') return <HomeOutlined />;
    if (key === 'news') return <MailOutlined />;
    if (key === 'dialogs') return <CommentOutlined />;
    if (key === 'friends') return <UserOutlined />;
    if (key === 'teams') return <TeamOutlined />;
    if (key === 'settings') return <SettingOutlined />;
};

const renderNavItems = (navitems: Array<INavItem>) => {
    const router = useRouter();
    return navitems.map(navitem => (
        <Link key={navitem.key} href={`/${navitem.key}`} as={navitem?.as}>
            <NavLink active={router.pathname === `/${navitem.key}`}>
                <div>{renderIcons(navitem.key)}</div>
                <div>{navitem.name}</div>
            </NavLink>
        </Link>
    ));
};

const Navbar: React.FC<INavbar> = ({ user }) => {
    const navitems: Array<INavItem> = [
        { key: 'global-search', name: 'Новые друзья...' },
        {
            key: 'userpage/[userID]',
            name: 'Моя страница',
            as: `/userpage/${user.userId}`,
        },
        { key: 'news', name: 'Новости' },
        { key: 'dialogs', name: 'Сообщения' },
        { key: 'friends', name: 'Друзья' },
        { key: 'teams', name: 'Сообщества' },
        { key: 'settings', name: 'Настройки' },
    ];

    return <StyledNavbar>{renderNavItems(navitems)}</StyledNavbar>;
};

export default Navbar;
