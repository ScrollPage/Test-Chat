import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import { getUserFromServer } from '@/utils/index.js';
import styled from 'styled-components';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import Search from '@/components/UI/Search';
import Friend from '@/components/Friends/Friend';

export default function GlobalSearch({ people, user }) {
  const { data } = useSWR(`/api/v1/people/`, { initialData: people });

  const renderPeople = people =>
    people.map(man => (
      <Friend
        key={`people__key__${man.id}`}
        name={`${man.first_name} ${man.last_name}`}
        userId={man.id}
        chatId={man.chat_id}
      />
    ));

  return (
    <PrivateLayout user={user}>
      <StyledGlobalSearch>
        <Search />
        {data ? (
          data.length === 0 ? (
            <h4>Нет людей по данному запросу</h4>
          ) : (
              renderPeople(data)
            )
        ) : (
            <h4>Загрузка</h4>
          )}
      </StyledGlobalSearch>
    </PrivateLayout>
  );
}

export const getServerSideProps = async ctx => {
  const token = cookies(ctx)?.token || null;

  axios.defaults.headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  if (!ctx?.req) {
    return {
      props: {
        people: [],
      },
    };
  }

  let people = [];

  await axios
    .get(`/api/v1/people/`)
    .then(response => {
      people = response?.data;
    })
    .catch(error => {
      console.log(error);
    });
  return {
    props: {
      people,
      user: getUserFromServer(ctx)
    },
  };
};

const StyledGlobalSearch = styled.div`
    display: flex;
    flex-direction: column;
`;
