import Head from 'next/head';
import styled from 'styled-components';
import { instanceWithSSR } from '@/api/api';
import useSWR from 'swr';
import DialogItem from '@/components/Dialog/DialogItem';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import { IUser } from '@/types/user';
import { IChat, IChatParticipiant } from '@/types/chat';
import { GetServerSideProps } from 'next';
import Search from '@/components/UI/Search';
import { useSelector } from 'react-redux';
import { getSearch } from '@/store/selectors';
import * as R from 'ramda';

interface IDialogs {
    chats: IChat[];
    user: IUser;
}

export default function Dialogs({ chats, user }: IDialogs) {
    const { data } = useSWR<IChat[]>('/api/v1/ref/chat/', {
        initialData: chats,
    });

    const search = useSelector(getSearch);
    const applySearch = (item: IChat) => {
        const chat = item.chat;
        return R.contains(
            search.toUpperCase(),
            (chat.is_chat && chat.companion
                ? `${chat.companion.first_name}${chat.companion.last_name}`
                : chat.name
                ? chat.name
                : ''
            ).toUpperCase()
        );
    };

    const renderChats = (chats: Array<IChat>) =>
        chats
            .filter(chat => applySearch(chat))
            .map(item => {
                const chat = item.chat;
                return (
                    <DialogItem
                        key={`chat__key__${chat.id}`}
                        name={
                            chat.is_chat && chat.companion
                                ? `${chat.companion.first_name} ${chat.companion.last_name}`
                                : chat.name
                                ? chat.name
                                : 'Ошибка'
                        }
                        chatId={chat.id}
                        dialogUser={chat.is_chat ? chat.companion : undefined}
                        unread={item.unread}
                    />
                );
            });

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Чат</title>
            </Head>
            <Search />
            <StyledDialogs>
                {data ? (
                    data.length === 0 ? (
                        <h4>У вас нет диалогов</h4>
                    ) : (
                        renderChats(data)
                    )
                ) : (
                    <h4>Загрузка...</h4>
                )}
            </StyledDialogs>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IDialogs> = async ctx => {
    ensureAuth(ctx);
    let chats: Array<IChat> = [];

    await instanceWithSSR(ctx)
        .get('/api/v1/ref/chat/')
        .then(response => {
            chats = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            chats,
            user: getUserFromServer(ctx),
        },
    };
};

const StyledDialogs = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;
