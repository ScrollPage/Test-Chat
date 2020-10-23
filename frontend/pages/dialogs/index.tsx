import styled from 'styled-components';
import { instanceWithSSR } from '@/api/api';
import useSWR from 'swr';
import DialogItem from '@/components/Dialog/DialogItem';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';
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
        return R.contains(
            search.toUpperCase(),
            getParticipantName(
                item.chat.participants[0],
                item.chat.participants[1]
            ).toUpperCase()
        );
    }

    const getParticipantName = (
        participant1: IChatParticipiant,
        participant2: IChatParticipiant
    ): string => {
        let partic;
        if (participant1.id === user.userId) {
            partic = participant2;
        } else {
            partic = participant1;
        }
        return `${partic.first_name} ${partic.last_name}`;
    };

    const getParticipant = (
        participant1: IChatParticipiant,
        participant2: IChatParticipiant
    ): IChatParticipiant => {
        let partic;
        if (participant1.id === user.userId) {
            partic = participant2;
        } else {
            partic = participant1;
        }
        return partic
    };

    const isConversation = (people: Array<IChatParticipiant>) => {
        if (people.length === 2) {
            return false;
        }
        return true;
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
                            isConversation(chat.participants)
                                ? `Беседа №${chat.id}`
                                : getParticipantName(
                                      chat.participants[0],
                                      chat.participants[1]
                                  )
                        }
                        chatID={chat.id}
                        dialogUser={
                            isConversation(chat.participants)
                                ? undefined
                                : getParticipant(
                                      chat.participants[0],
                                      chat.participants[1]
                                  )
                        }
                    />
                )
            });

    return (
        <PrivateLayout user={user}>
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
            user: getUserFromServer(ctx)
        },
    };
};

const StyledDialogs = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;
