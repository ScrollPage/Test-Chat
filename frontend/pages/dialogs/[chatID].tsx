import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { ensureAuth, getAsString, getUserFromServer } from '@/utils/index';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { message as actionMessage } from '@/store/actions/message';
import WebSocketInstance from '@/websocket';
import ChatItem from '@/components/Chat/ChatItem';
import ChatInput from '@/components/Chat/ChatInput/ChatInput';
import ChatHeader from '@/components/Chat/ChatHeader';
import Loading from '@/components/UI/Loading';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getMessages, getMessagesLoading } from '../../store/selectors';
import { IUser } from '@/types/user';
import { GetServerSideProps } from 'next';
import { IMessages } from '@/types/message';
import { instanceWithSSR } from '@/api/api';
import { IChatInfo } from '@/types/chat';
import { removeMessageNotify } from '@/store/actions/notify';

interface ChatPage {
    user: IUser;
    chatInfo: IChatInfo | null;
}

export default function ChatPage({ user, chatInfo }: ChatPage) {
    const dispatch = useDispatch();

    const messages = useSelector(getMessages);
    const loading = useSelector(getMessagesLoading);

    const { query } = useRouter();

    const [message, setMessage] = useState('');

    let messagesEnd = useRef<HTMLDivElement>();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        dispatch(actionMessage.setLoading());
        initialiseChat();
        return () => {
            WebSocketInstance.disconnect();
        };
    }, [query.chatID]);

    const initialiseChat = (): void => {
        waitForSocketConnection(() => {
            WebSocketInstance.fetchMessages(user.userId, query.chatID);
        });
        WebSocketInstance.connect(query.chatID);
    };

    const waitForSocketConnection = (callback: () => void): void => {
        setTimeout(function() {
            if (WebSocketInstance.state() === 1) {
                console.log('Connection is made');
                callback();
            } else {
                console.log('wait for connection...');
                waitForSocketConnection(callback);
            }
        }, 100);
    };

    const messageChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setMessage(e.target.value);
    };

    const sendMessageHandler = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (message.trim() !== '') {
            const messageObject = {
                from: user.userId,
                content: message,
                chatId: query.chatID,
            };
            WebSocketInstance.newChatMessage(messageObject);
            setMessage('');
        }
    };

    const scrollToBottom = () => {
        // @ts-ignore: Unreachable code error
        messagesEnd.scrollIntoViewIfNeeded({ behavior: 'smooth' });
    };

    const renderMessages = (messages: IMessages) => {
        return messages.map(message => {
            return (
                <ChatItem
                    key={`Message__key__${message.id}__${Math.random()}`}
                    name={`${message.first_name} ${message.last_name}`}
                    time={message.timestamp}
                    message={message.content}
                    messageUserId={message.author}
                    avatar={message.small_avatar}
                />
            );
        });
    };

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Чат</title>
            </Head>
            <StyledChat>
                {chatInfo && <ChatHeader chatInfo={chatInfo} />}
                <StyledChatInner>
                    {!messages || loading ? (
                        <div className="chat__loading">
                            <Loading />
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="not-messages">У вас нет сообщений</p>
                    ) : (
                        renderMessages(messages)
                    )}
                    <div
                        className="messages-end"
                        // @ts-ignore: Unreachable code error
                        ref={el => (messagesEnd = el)}
                    />
                </StyledChatInner>
                <ChatInput
                    sendMessage={sendMessageHandler}
                    messageChange={messageChangeHandler}
                    message={message}
                />
            </StyledChat>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<ChatPage> = async ctx => {
    ensureAuth(ctx);
    const chatId = getAsString(ctx?.params?.chatID);
    let chatInfo: IChatInfo | null = null;

    await instanceWithSSR(ctx)
        .get(`/api/v1/chat/${chatId}/`)
        .then(response => {
            chatInfo = response?.data;
        })
        .catch(error => {
            console.log(error);
        });

    return {
        props: {
            user: getUserFromServer(ctx),
            chatInfo: chatInfo || null,
        },
    };
};

const StyledChat = styled.div`
    position: relative;
    max-height: calc(100vh - 80px);
    min-height: calc(100vh - 80px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 5px;
        border-radius: 50%;
        background-color: #f5f5f5;
        @media (max-width: 575.98px) {
            width: 0px;
        }
    }
    &::-webkit-scrollbar-track {
        height: 90%;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #1890ff;
    }
`;

const StyledChatInner = styled.div`
    min-height: calc(100vh - 210px);
    position: relative;
    .not-messages {
        position: absolute;
        top: 50%;
        margin-top: -10.5px;
        left: 50%;
        margin-left: -67.5px;
        font-weight: 700;
        opacity: 0.7;
    }
    .messages-end {
        float: left;
        clear: both;
        position: absolute;
        bottom: -50px;
        left: 0;
    }
    .chat__loading {
        height: 90vh;
    }
`;
