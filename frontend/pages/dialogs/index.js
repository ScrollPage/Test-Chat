import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import Dialog from '@/components/Dialogs/Dialog';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';

export default function Dialogs({ chats, user }) {
    const { data } = useSWR(`/api/v1/chat/?id=${user.userId}`, {
        initialData: chats,
    });

    console.log(data);

    const participant = (participant1, participant2, isId) => {
        let partic;
        if (participant1.id === Number(user.userId)) {
            partic = participant2;
        } else {
            partic = participant1;
        }
        if (isId) {
            return partic.id
        } else {
            return `${partic.first_name} ${partic.last_name}`
        }
    }

    const isConversation = (people) => {
        if (people.length === 2) {
            return false
        }
        return true
    }

    const renderChats = chats =>
        chats.map(chat => (
            <Dialog
                key={`chat__key__${chat.id}`}
                name={isConversation(chat.participants) ? `Беседа №${chat.id}` : participant(chat.participants[0], chat.participants[1], false)}
                chatID={chat.id}
                dialogUserId={isConversation(chat.participants) ? null : participant(chat.participants[0], chat.participants[1], true)}
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

export const getServerSideProps = async ctx => {
    const token = cookies(ctx)?.token || null;

    const user = getUserFromServer(ctx);
    const { userId } = user;
    
    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };

    if (!ctx?.req) {
        return {
            props: {
                chats: [],
                userId
            },
        };
    }

    let chats = [];

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
            user: user
        },
    };
};

const StyledDialogs = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;
