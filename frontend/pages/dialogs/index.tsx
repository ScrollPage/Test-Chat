import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import Dialog from '@/components/Dialogs/Dialog';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';
import { IUser } from '@/types/user';
import { IChat, IChatParticipiant } from '@/types/chat';
import { GetServerSideProps } from 'next';

interface IDialogs {
    chats: IChat[];
    user: IUser;
}

export default function Dialogs({ chats, user }: IDialogs) {
    const { data } = useSWR<IChat[]>(`/api/v1/chat/?id=${user.userId}`, { initialData: chats });  

    const participantName = (participant1: IChatParticipiant, participant2: IChatParticipiant): string => {
        let partic;
        if (participant1.id === user.userId) {
            partic = participant2;
        } else {
            partic = participant1;
        }
        return `${partic.first_name} ${partic.last_name}`
    }

    const participant = (participant1: IChatParticipiant, participant2: IChatParticipiant): IChatParticipiant => {
        let partic;
        if (participant1.id === user.userId) {
            partic = participant2;
        } else {
            partic = participant1;
        }
        return partic
    }

    const isConversation = (people: Array<IChatParticipiant>) => {
        if (people.length === 2) {
            return false
        }
        return true
    }

    console.log(data);

    const renderChats = (chats: Array<IChat>) =>
        chats.map(chat => (
            <Dialog
                key={`chat__key__${chat.id}`}
                name={isConversation(chat.participants) ? `Беседа №${chat.id}` : participantName(chat.participants[0], chat.participants[1])}
                chatID={chat.id}
                dialogUser={isConversation(chat.participants) ? null : participant(chat.participants[0], chat.participants[1])}
            />
        ));

    return (
        <PrivateLayout user={user}>
            <SearchDialog />
            <StyledDialogs>
                {data
                    ? data.length === 0
                        ? <h4>У вас нет диалогов</h4>
                        : renderChats(data)
                    : <h4>Загрузка...</h4>}
            </StyledDialogs>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IDialogs> = async (ctx) => {
    const token = cookies(ctx)?.token || null;

    const user: IUser = getUserFromServer(ctx);
    const { userId } = user;
    
    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };

    let chats: Array<IChat> = [];

    if (!ctx?.req) {
        return {
            props: {
                chats,
                user
            },
        };
    }
    await axios
        .get(`/api/v1/chat/?id=${userId}`)
        .then(response => {
            chats = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            chats,
            user
        },
    };
};

const StyledDialogs = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;
