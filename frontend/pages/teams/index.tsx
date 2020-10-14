import PrivateLayout from '@/components/Layout/PrivateLayout';
import { ITeam } from '@/types/contact';
import { IUser } from '@/types/user';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import SearchDialog from '@/components/UI/Search';
import styled from 'styled-components';
import Team from '@/components/Party/PartyItem';
import { instanceWithSSR } from '@/api/api';

interface ITeamsFC {
  user: IUser;
  parties: ITeam[];
}

export default function Teams({ user, parties }: ITeamsFC) {
  const { data } = useSWR<ITeam[]>(`/api/v1/group/`, {
    initialData: parties,
  });

  const renderTeams = (parties: ITeam[]) =>
    parties.map(party => (
      <Team
        key={`party__key__${party.id}`}
        name={party.name}
        image={party.image}
        partyId={party.id}
      />
    ));

  return (
    <PrivateLayout user={user}>
      <SearchDialog />
      <StyledTeams>
        {data ? (
          data.length === 0 ? (
            <h4>У вас нет друзей</h4>
          ) : (
            renderTeams(data)
          )
        ) : (
          <h4>Загрузка...</h4>
        )}
      </StyledTeams>
    </PrivateLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ITeamsFC> = async ctx => {

  if (!ctx?.req) {
    return {
      props: {
        parties: [],
        user: getUserFromServer(ctx),
      },
    };
  }

  let parties: ITeam[] = [];

  await instanceWithSSR(ctx)
    .get(`/api/v1/group/`)
    .then(response => {
      parties = response?.data;
    })
    .catch(error => {
      console.log(error);
    });
  return {
    props: {
      parties,
      user: getUserFromServer(ctx),
    },
  };
};

const StyledTeams = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  h4 {
    margin-top: 10px;
  }
`;
