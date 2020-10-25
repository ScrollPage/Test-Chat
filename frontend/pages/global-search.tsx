import Head from 'next/head';
import { instanceWithSSR } from '@/api/api';
import useSWR from 'swr';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import styled from 'styled-components';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import Search from '@/components/UI/Search';
import FriendItem from '@/components/Friend/FriendItem';
import { IUser } from '@/types/user';
import { IGlobalUser } from '@/types/people';
import { GetServerSideProps } from 'next';
import { getSearch } from '@/store/selectors';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

interface IGlobalSearch {
    people: IGlobalUser[];
    user: IUser;
}

export default function GlobalSearch({ people, user }: IGlobalSearch) {
    const { data } = useSWR<IGlobalUser[]>(`/api/v1/people/`, {
        initialData: people,
    });

    const search = useSelector(getSearch);

    const applySearch = (item: IGlobalUser) =>
        R.contains(
            search.toUpperCase(),
            `${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}`
        );

    const renderPeople = (people: Array<IGlobalUser>) =>
        people
            .filter(man => applySearch(man))
            .map(man => (
                <FriendItem
                    key={`people__key__${man.id}`}
                    name={`${man.first_name} ${man.last_name}`}
                    friendId={man.id}
                    chatId={man.chat_id}
                    src={man.small_avatar}
                />
            ));

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Поиск</title>
            </Head>
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

export const getServerSideProps: GetServerSideProps<IGlobalSearch> = async ctx => {
    ensureAuth(ctx);
    let people: Array<IGlobalUser> = [];

    await instanceWithSSR(ctx)
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
            user: getUserFromServer(ctx),
        },
    };
};

const StyledGlobalSearch = styled.div`
    display: flex;
    flex-direction: column;
`;
