import styled from 'styled-components';
import { instanceWithSSR } from '@/api/api';
import cookies from 'next-cookies';
import useSWR from 'swr';
import Friend from '@/components/Friend/FriendItem';
import Search from '@/components/UI/Search';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import { IGlobalUser } from '@/types/people';
import { IUser } from '@/types/user';
import { useSelector } from 'react-redux';
import { getSearch } from '@/store/selectors';
import * as R from 'ramda'

interface IFriends {
    friends: IGlobalUser[];
    user: IUser;
}

export default function Friends({ friends, user }: IFriends) {
    const { data } = useSWR<IGlobalUser[]>(`/api/v1/friends/`, { initialData: friends });

    const search = useSelector(getSearch);

    const applySearch = (item: IGlobalUser) => R.contains(
        search.toUpperCase(), `${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}`
    )

    const renderFriends = (friends: Array<IGlobalUser>) =>
        friends
            .filter(friend => applySearch(friend))
            .map(friend => (
            <Friend
                key={`friend__key__${friend.id}`}
                name={`${friend.first_name} ${friend.last_name}`}
                friendId={friend.id}
                chatId={friend.chat_id}
                src={friend.small_avatar}
            />
        ));

    return (
        <PrivateLayout user={user}>
            <Search />
            <StyledFriends>
                {data ? (
                    data.length === 0 ? (
                        <h4>У вас нет друзей</h4>
                    ) : (
                        renderFriends(data)
                    )
                ) : (
                    <h4>Загрузка...</h4>
                )}
            </StyledFriends>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IFriends> = async (ctx) => {
    let friends: Array<IGlobalUser> = [];

    await instanceWithSSR(ctx)
        .get(`/api/v1/friends/`)
        .then(response => {
            friends = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            friends,
            user: getUserFromServer(ctx)
        },
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
