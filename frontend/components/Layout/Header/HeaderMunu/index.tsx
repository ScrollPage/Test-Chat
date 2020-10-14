import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { StyledAvatarMenu } from './styles';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface IHeaderMenu {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    logoutHandler: () => void;
}

const HeaderMenu: React.FC<IHeaderMenu> = ({
    menuOpen,
    setMenuOpen,
    logoutHandler,
}) => {
    return (
        <div>
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
        </div>
    );
};

export default HeaderMenu;
