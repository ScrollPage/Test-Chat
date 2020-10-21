import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/actions/auth';
import Container from '@/styles/Container';
import { IUser } from '@/types/user';
import { StyledAvatar, StyledHeader, StyledHeaderInner } from './styles';
import ImageLink from '@/components/UI/Image/LinkImage';
import HeaderMenu from './HeaderMunu';
import Notify from '@/components/UI/Notify';

interface IHeader {
    user: IUser;
}

const Header: React.FC<IHeader> = ({ user }) => {
    const dispatch = useDispatch();

    const [menuOpen, setMenuOpen] = useState(false);

    const logoutHandler = (): void => {
        dispatch(logout());
    };
    let newUser: IUser = { ...user };

    useEffect(() => {
        newUser.smallAvatar = Cookie.get('smallAvatar');
    }, [Cookie.get('smallAvatar')]);

    return (
        <StyledHeader>
            <Container>
                <StyledHeaderInner>
                    <div>Scroll Chat</div>
                    <StyledAvatar>
                        <div className="header__avatar">
                            <ImageLink
                                src={newUser.smallAvatar}
                                href="/userpage/[userID]"
                                as={`/userpage/${user?.userId}`}
                                size={'35'}
                            />
                        </div>
                        <p
                            onClick={() => setMenuOpen(state => !state)}
                        >{`${user?.firstName} ${user?.lastName}`}</p>
                        <HeaderMenu
                            setMenuOpen={setMenuOpen}
                            menuOpen={menuOpen}
                            logoutHandler={logoutHandler}
                        />
                        <div className="header__notify">
                            <Notify />
                        </div>
                    </StyledAvatar>
                </StyledHeaderInner>
            </Container>
        </StyledHeader>
    );
};

export default Header;
