import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import WebSocketInstance from '@/websocket';
import Pusher from 'pusher-js';

import { authCheckState } from '@/store/actions/auth';
import { setMessages, addMessage } from '@/store/actions/message';
import { show } from '@/store/actions/alert';

import Header from './Header';
import Navbar from './Navbar';
import Container from '@/styles/Container';

import { IUser } from '@/types/user';

// interface IPrivateLayout {
//     children: React.ReactNode;
//     user: IUser;
// } 

const PrivateLayout = ({ children, user }) => {

    const dispatch = useDispatch();

    const setMessagesHandler = messages => {
        dispatch(setMessages(messages));
    };

    const addMessageHandler = message => {
        dispatch(addMessage(message));
    };

    useEffect(() => {
        dispatch(authCheckState());
        WebSocketInstance.addCallbacks(setMessagesHandler, addMessageHandler);
    }, []);

    useEffect(() => {
        const pusher = new Pusher('3beceac9a6f0281fb76b', {
            cluster: 'eu',
            encrypted: true
        });
        const channel = pusher.subscribe(`notifications${user?.userId}`);
        channel.bind('new_request', function (data) {
            show(`${data.name} хочет добавить вас в друзья`, 'success');
            alert(`${data.name} хочет добавить вас в друзья`);
        });
        channel.bind('new_like', function (data) {
            show(`${data.name} оценил вашу запись`, 'success');
            alert(`${data.name} оценил вашу запись`);
        });
        channel.bind('new_message', function (data) {
            show(`${data.name} отправил вам сообщение`, 'success');
            alert(`${data.name} отправил вам сообщение`);
        });
        channel.bind('new_friend', function (data) {
            show(`${data.name} принял вашу заявку в друзья`, 'success');
            alert(`${data.name} принял вашу заявку в друзья`);
        });
        return () => {
            pusher.disconnect();
        }

    }, [user])

    return (
        <>
            <Header user={user} />
            <StyledMain>
                <Container>
                    <Navbar user={user} />
                    <div className="private-layout__main">{children}</div>
                </Container>
            </StyledMain>
        </>
    );
};

export default PrivateLayout;

const StyledMain = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding-top: 60px;
    @media (max-width: 575.98px) {
        padding-top: 70px;
    }
    .private-layout__main {
        margin-left: 180px;
        @media (max-width: 575.98px) {
            margin-left: 55px;
        }
    }
`;
