import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { StyledAvatarMenu, StyledBackDrop, StyledHeaderMenu } from './styles';
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

    const menuOpenHandler = () => {
        setMenuOpen(state => !state);
    };

    return (
        <StyledHeaderMenu menuOpen={menuOpen} >
            <div
                className="styled-avatar__arrow"
                onClick={() => menuOpenHandler()}
            >
                {menuOpen ? <UpOutlined /> : <DownOutlined />}
            </div>
            <div className="styled-avatar__container">
                <StyledAvatarMenu>
                    <div>
                        <Link href="/settings">
                            <a>Настройки</a>
                        </Link>
                    </div>
                    <div onClick={logoutHandler}>Выйти</div>
                </StyledAvatarMenu>
            </div>
            {menuOpen && <StyledBackDrop onClick={() => menuOpenHandler()} />}
        </StyledHeaderMenu>
    );
};

export default HeaderMenu;
