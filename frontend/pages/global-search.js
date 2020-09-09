import PrivateLayout from '@/components/Layout/PrivateLayout';
import Search from '@/components/UI/Search';
import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import Friend from '@/components/Friends/Friend';
import { SearchContext } from '@/context/search/SearchContext';
import { useContext } from 'react';

export default function News() {

  const { search } = useContext(SearchContext);

  const { data } = useSWR(`/api/v1/people/?query_name=${search}`);

  const renderPeople = (people) => (
    people.map(man => (
      <Friend
        key={`people__key__${man.id}`}
        name={`${man.first_name} ${man.last_name}`}
        userId={man.id}
        chatId={man.chat_id}
      />
    ))
  );

  return (
    <PrivateLayout>
      <StyledGlobalSearch>
        <Search />
        <hr/>
        {data && renderPeople(data)}
      </StyledGlobalSearch>
    </PrivateLayout>
  );
}

export const getServerSideProps = async (ctx) => {

  const token = cookies(ctx)?.token || null;

  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`
  };

  let people = null;

  await axios
    .get(`/api/v1/people/`)
    .then((response) => {
      people = response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return {
    props: {
      people: people
    }
  };
}

const StyledGlobalSearch = styled.div`
  display: flex;
  flex-direction: column;
  hr {
    border: 1px solid white;
  }
`;



