import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import Friend from '@/components/Friends/Friend';
import SearchDialog from '@/components/Dialogs/SearchDialog';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import { IGlobalUser } from '@/types/people';
import { IUser } from '@/types/user';

interface IFriends {
    friends: IGlobalUser[];
    user: IUser;
}

export default function Friends({ friends, user }: IFriends) {
    const { data } = useSWR<IGlobalUser[]>(`/api/v1/friends/`, { initialData: friends });

    const renderFriends = (friends: Array<IGlobalUser>) =>
        friends.map(friend => (
            <Friend
                key={`friend__key__${friend.id}`}
                name={`${friend.first_name} ${friend.last_name}`}
                friendId={friend.id}
                chatId={friend.chat_id}
                src={friend.avatar}
            />
        ));

    return (
        <PrivateLayout user={user}>
            <SearchDialog />
            <StyledFriends>
                {data ? (
                    data.length === 0 ? (
                        <p>У вас нет друзей</p>
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
    const token = cookies(ctx)?.token || null;

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };

    if (!ctx?.req) {
        return {
            props: {
                friends: [],
                user: getUserFromServer(ctx)
            },
        };
    }

    let friends: Array<IGlobalUser> = [];

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
