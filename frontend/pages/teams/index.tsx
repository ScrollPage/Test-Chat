import Head from 'next/head';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { ITeam } from '@/types/contact';
import { IUser } from '@/types/user';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import Search from '@/components/UI/Search';
import styled from 'styled-components';
import Team from '@/components/Party/PartyItem';
import { instanceWithSSR } from '@/api/api';
import { useSelector } from 'react-redux';
import { getSearch } from '@/store/selectors';
import * as R from 'ramda';

interface ITeamsFC {
    user: IUser;
    parties: ITeam[];
}

export default function Teams({ user, parties }: ITeamsFC) {
    const { data } = useSWR<ITeam[]>(`/api/v1/group/`, {
        initialData: parties,
    });

    const search = useSelector(getSearch);

    const applySearch = (item: ITeam) =>
        R.contains(search.toUpperCase(), item.name.toUpperCase());

    const renderTeams = (parties: ITeam[]) =>
        parties
            .filter(party => applySearch(party))
            .map(party => (
                <Team
                    key={`party__key__${party.id}`}
                    name={party.name}
                    image={party.image}
                    partyId={party.id}
                />
            ));

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Сообщества</title>
            </Head>
            <Search />
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
    ensureAuth(ctx);
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
