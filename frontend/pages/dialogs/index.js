import PrivateLayout from '@/components/Layout/PrivateLayout';
import styled from 'styled-components';
import Dialog from '@/components/Dialogs/Dialog';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';

export default function Dialogs({ chats, username }) {

  const { data } = useSWR(`/api/v1/chat/?username=${username}`, { initialData: chats});

  const renderChats = (chats) => (
    chats.map(chat => (
      <Dialog
        key={`message__key__${chat.id}`}
        name={chat.participants.length === 2 ? chat.participants[0].user === username ? chat.participants[1].user : chat.participants[0].user : `Беседа Номер ${chat.id}`}
        chatID={chat.id}
      />
    ))
  );

  return (
    <PrivateLayout>
      <SearchDialog />
      <StyledDialogs>
        {data.length === 0 ? 'У вас нет диалогов' : renderChats(chats)}
      </StyledDialogs>
    </PrivateLayout>
  );
}

export const getServerSideProps = async (ctx) => {

  const username = cookies(ctx)?.username || null; 
  const token = cookies(ctx)?.token || null; 

  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`
  };

  let chats = null;

  await axios
    .get(`/api/v1/chat/?username=${username}`)
    .then((response) => {
      chats = response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return { props: { 
    chats: chats,
    username: username
   }};
}

const StyledDialogs = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;