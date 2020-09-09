import PrivateLayout from '@/components/Layout/PrivateLayout';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import Friend from '@/components/Friends/Friend';
import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';

export default function Friends({friends, userId}) {

  const { data } = useSWR(`/api/v1/friends/${userId}`, { initialData: friends});

  console.log(data);

  const renderFriends = (friends) => (
    friends.map(friend => (
      <Friend
        key={`friend__key__${friend.id}`}
        name={`${friend.first_name} ${friend.last_name}`}
        userId={friend.id}
        chatId={friend.chat_id}
      />
    ))
  );

  return (
    <PrivateLayout>
      <SearchDialog />
      <StyledFriends>
        {data !== null ? data.length === 0 ? <p>У вас нет друзей</p> : renderFriends(data) : <p>Ошибка</p>}
      </StyledFriends>
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

  let friends = null;

  await axios
    .get(`/api/v1/friends/${userId}`)
    .then((response) => {
      friends = response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return { props: { 
    friends: friends,
    userId: userId
  }};
}

const StyledFriends = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;