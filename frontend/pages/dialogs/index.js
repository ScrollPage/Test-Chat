import PrivateLayout from '@/components/Layout/PrivateLayout';
import styled from 'styled-components';
import Dialog from '@/components/Dialogs/Dialog';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';

export default function Dialogs({ chats, userId }) {

  const { data } = useSWR(`/api/v1/chat/?id=${userId}`, { initialData: chats});

  const renderChats = (chats) => (
    chats.map(chat => (
      <Dialog
        key={`chat__key__${chat.id}`}
        name={chat.participants.length === 2 ? chat.participants[0].id === userId ? chat.participants[1].id : `${chat.participants[0].first_name} ${chat.participants[0].last_name}` : `Беседа Номер ${chat.id}`}
        chatID={chat.id}
      />
    ))
  );

  return (
    <PrivateLayout>
      <SearchDialog />
      <StyledDialogs>
        {data !== null ? data.length === 0 ? 'У вас нет диалогов' : renderChats(data) : 'Ошибка'}
      </StyledDialogs>
    </PrivateLayout>
  );
}

export const getServerSideProps = async (ctx) => {

  const userId = cookies(ctx)?.userId || null; 
  const token = cookies(ctx)?.token || null; 

  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`
  };

  let chats = null;

  await axios
    .get(`/api/v1/chat/?id=${userId}`)
    .then((response) => {
      chats = response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return { props: { 
    chats: chats,
    userId: userId
   }};
}

const StyledDialogs = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;