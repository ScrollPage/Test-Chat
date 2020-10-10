import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import { getUserFromServer } from '@/utils/index';
import styled from 'styled-components';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import UserInfo from '@/components/Userpage/UserInfo';
import UserAvatar from '@/components/Userpage/UserAvatar';
import UserFriends from '@/components/Userpage/UserFriends';
import UserPosts from '@/components/Userpage/UserPosts';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { IContact } from '@/types/contact';
import { GetServerSideProps } from 'next';
import UserParties from '@/components/Userpage/UserParties';

interface ITeams {
    contact: IContact | null;
    pageUserId: number | undefined;
    posts: IPost[];
    user: IUser;
}

export default function Teams({ contact, pageUserId, posts, user }: ITeams) {
    const { data } = useSWR(`/api/v1/contact/${pageUserId}/`, {
        initialData: contact,
    });

    console.log(data);

    return (
        <PrivateLayout user={user}>
            <StyledUser>
                <div>
                    {data && pageUserId ? (
                        <>
                            <UserAvatar
                                contact={data}
                                pageUserId={pageUserId}
                                chatId={data.chat_id}
                                user={user}
                            />
                            <div className="user-avatar__join">
                                <h4>Друзья: {`(${data.num_friends})`}</h4>
                                <UserFriends people={data.my_page.friends} />
                            </div>
                            <div className="user-avatar__join">
                                <h4>Сообщества: {`(${data.my_page.parties.length})`}</h4>
                                <UserParties parties={data.my_page.parties} />
                            </div>
                        </>
                    ) : (
                        <h4>Загрузка личных данных ...</h4>
                    )}
                </div>
                <div className="user-info">
                    {data ? <UserInfo contact={data} /> : <h4>Загрузка...</h4>}
                    {posts && pageUserId ? (
                        <UserPosts
                            serverPosts={posts}
                            pageUserId={pageUserId}
                            user={user}
                        />
                    ) : (
                        <h4>Загрузка постов...</h4>
                    )}
                </div>
            </StyledUser>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<ITeams> = async ctx => {
    const pageUserId = ctx?.params?.userID?.[0];
    const token = cookies(ctx)?.token || null;

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };

    let contact: IContact | null = null;
    let posts: Array<IPost> = [];

    await axios
        .get(`/api/v1/contact/${pageUserId}/`)
        .then(response => {
            contact = response?.data;
        })
        .catch(error => {
            console.log(error);
        });

    await axios
        .get(`/api/v1/post/?id=${pageUserId}`)
        .then(response => {
            posts = response?.data;
        })
        .catch(error => {
            console.log(error);
        });

    return {
        props: {
            contact,
            pageUserId: Number(pageUserId),
            posts,
            user: getUserFromServer(ctx),
        },
    };
};

const StyledUser = styled.div`
    margin-top: 10px;
    display: flex;
    .user-avatar__join {
        background-color: #f4f4f4;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
        margin-top: 20px;
        padding: 10px;
        @media (max-width: 900px) {
            margin-right: 0px;
        }
    }
    .user-info {
        flex: 1;
    }
    @media (max-width: 900px) {
        flex-direction: column;
    }
`;
