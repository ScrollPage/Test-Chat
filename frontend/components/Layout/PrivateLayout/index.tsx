import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
    INewFriend,
    INewLike,
    INewMessage,
    INewRepost,
    INewRequest,
} from '@/types/notify';
import Cookie from 'js-cookie';
import { getMessageNotify, getNotify } from '@/store/selectors';
import { addMessageNotify, addNotify } from '@/store/actions/notify';

interface IPrivateLayout {
    children: React.ReactNode;
    user: IUser;
}

const PrivateLayout: React.FC<IPrivateLayout> = ({ children, user }) => {
    const dispatch = useDispatch();

    const notify = useSelector(getNotify);

    const messageNotify = useSelector(getMessageNotify);

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
            encrypted: true,
        });
        const channel = pusher.subscribe(`notifications${user?.userId}`);

        channel.bind('new_request', function(data: INewRequest) {
            dispatch(addNotify());
            dispatch(show(`${data.name} хочет добавить вас в друзья`, 'success', true));
        });
        channel.bind('new_like', function(data: INewLike) {
            let text = '';
            if (data.type === 'comment') {
                text = `${data.name} оценил ваш комментарий`;
            }
            if (data.type === 'post') {
                text = `${data.name} оценил ваш пост`;
            }
            if (data.type === 'photo') {
                text = `${data.name} оценил ваше фото`;
            }
            dispatch(addNotify());
            dispatch(show(text, 'success', true));
        });
        channel.bind('new_message', function(data: INewMessage) {
            dispatch(addMessageNotify());
            dispatch(show(`${data.name} отправил вам сообщение`, 'success', true));
        });
        channel.bind('new_friend', function(data: INewFriend) {
            dispatch(addNotify());
            dispatch(show(`${data.name} принял вашу заявку в друзья`, 'success', true));
        });
        channel.bind('new_repost', function(data: INewRepost) {
            dispatch(addNotify());
            dispatch(show(`${data.name} репостнул вашу запись`, 'success', true));
        });
        return () => {
            pusher.disconnect();
        };
    }, [user]);

    useEffect(() => {
        Cookie.set('notify', String(notify));
        Cookie.set('messageNotify', String(messageNotify));
    }, [notify, messageNotify])

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
