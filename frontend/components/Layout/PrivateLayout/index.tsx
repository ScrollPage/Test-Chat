import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WebSocketInstance from '@/websocket';
import Pusher from 'pusher-js';
import { authCheckState } from '@/store/actions/auth';
import { setMessages, message as actionMessage } from '@/store/actions/message';
import { show } from '@/store/actions/alert';
import Header from '../Header';
import Navbar from '../Navbar';
import Container from '@/styles/Container';
import { IUser } from '@/types/user';
import { IMessage, IMessages } from '@/types/message';
import RootModal from '../../Modal';
import { StyledMain } from './styles';

interface IPrivateLayout {
    children: React.ReactNode;
    user: IUser;
} 

const PrivateLayout: React.FC<IPrivateLayout> = ({ children, user }) => {

    const dispatch = useDispatch();

    const setMessagesHandler = (messages: IMessages) => {
        dispatch(setMessages(messages));
    };

    const addMessageHandler = (message: IMessage) => {
        dispatch(actionMessage.addMessage(message));
    };

    useEffect(() => {
        dispatch(authCheckState());
        WebSocketInstance.addCallbacks(setMessagesHandler, addMessageHandler);
    }, []);

    useEffect(() => {
        const pusher = new Pusher('3beceac9a6f0281fb76b', {
            cluster: 'eu',
            // @ts-ignore: Unreachable code error
            encrypted: true
        });
        const channel = pusher.subscribe(`notifications${user?.userId}`);

        channel.bind('new_request', function (data: any) {
            show(`${data.name} хочет добавить вас в друзья`, 'success');
        });
        channel.bind('new_like', function (data: any) {
            show(`${data.name} оценил вашу запись`, 'success');
        });
        channel.bind('new_message', function (data: any) {
            show(`${data.name} отправил вам сообщение`, 'success');
        });
        channel.bind('new_friend', function (data: any) {
            show(`${data.name} принял вашу заявку в друзья`, 'success');
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
            <RootModal />
        </>
    );
};

export default PrivateLayout;

