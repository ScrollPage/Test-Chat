import React from 'react';
import {
    ReadOutlined,
    SettingOutlined,
    CommentOutlined,
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    SearchOutlined,
    FolderOpenOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IUser } from '@/types/user';
import { StyledNavbar, NavLink } from './styles';
import { useSelector } from 'react-redux';
import { getMessageNotify } from '@/store/selectors';

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
    if (key === 'news') return <ReadOutlined />;
    if (key === 'dialogs') return <CommentOutlined />;
    if (key === 'friends') return <UserOutlined />;
    if (key === 'teams') return <TeamOutlined />;
    if (key === 'photos/[userID]') return <FolderOpenOutlined />;
    if (key === 'settings') return <SettingOutlined />;
};

const renderNavItems = (navitems: Array<INavItem>, messageNotify: number) => {
    const router = useRouter();
    return navitems.map(navitem => (
        <Link key={navitem.key} href={`/${navitem.key}`} as={navitem?.as}>
            <NavLink active={router.pathname === `/${navitem.key}`}>
                <div>{renderIcons(navitem.key)}</div>
                <div className='nav-link__name'>{navitem.name}</div>
                {navitem.key === 'dialogs' && messageNotify !== 0 && (
                    <div className="nav-link__dialogs">
                        <span>{messageNotify}</span>
                    </div>
                )}
            </NavLink>
        </Link>
    ));
};

const Navbar: React.FC<INavbar> = ({ user }) => {
    const messageNotify = useSelector(getMessageNotify);
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
        {
            key: 'photos/[userID]',
            name: 'Фотографии',
            as: `/photos/${user.userId}`,
        },
        { key: 'settings', name: 'Настройки' },
    ];

    return <StyledNavbar>{renderNavItems(navitems, messageNotify)}</StyledNavbar>;
};

export default Navbar;
