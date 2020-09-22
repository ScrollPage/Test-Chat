import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import Friend from '@/components/Friends/Friend';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import PrivateLayout from '@/components/Layout/PrivateLayout';

export default function Friends({ friends }) {
  const { data } = useSWR(`/api/v1/friends/`, { initialData: friends });

  const renderFriends = friends =>
    friends.map(friend => (
      <Friend
        key={`friend__key__${friend.id}`}
        name={`${friend.first_name} ${friend.last_name}`}
        userId={friend.id}
        chatId={friend.chat_id}
      />
    ));

  return (
    <PrivateLayout>
      <SearchDialog />
      <StyledFriends>
        {data !== null ? (
          data.length === 0 ? (
            <p>У вас нет друзей</p>
          ) : (
            renderFriends(data)
          )
        ) : (
          <h4>У вас нет друзей</h4>
        )}
      </StyledFriends>
    </PrivateLayout>
  );
}

export const getServerSideProps = async ctx => {
  // const userId = cookies(ctx)?.userId || null;
  const token = cookies(ctx)?.token || null;

  axios.defaults.headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`
  };

  let friends = null;

  await axios
    .get(`/api/v1/friends/`)
    .then(response => {
      friends = response?.data;
    })
    .catch(error => {
      console.log(error);
    });
  return {
    props: {
      friends
    }
  };
};

const StyledFriends = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  h4 {
    margin-top: 10px;
  }
`;
