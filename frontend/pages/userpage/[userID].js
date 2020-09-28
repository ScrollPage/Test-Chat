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

export default function Teams({ contact, pageUserId, posts, user }) {

    const { data } = useSWR(`/api/v1/contact/${pageUserId}/`, { initialData: contact });

    return (
        <PrivateLayout user={user}>
            <StyledUser>
                <div>
                    <UserAvatar
                        data={data}
                        pageUserId={pageUserId}
                        chatId={data.chat_id}
                        user={user}
                    />
                    <div className="user-avatar__friends">
                        <h4>Друзья: {`(${data.num_friends})`}</h4>
                        <UserFriends friends={data.my_page.friends} />
                    </div>
                </div>
                <div className="user-info">
                    <UserInfo data={data} />
                    <UserPosts serverPosts={posts} pageUserId={pageUserId} user={user}/>
                </div>
            </StyledUser>
        </PrivateLayout>
    );
}

export const getServerSideProps = async ctx => {
    const pageUserId = ctx.params.userID;
    const token = cookies(ctx)?.token || null;

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };

    let contact = null;
    let posts = [];

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
            pageUserId,
            posts,
            user: getUserFromServer(ctx)
        },
    };
};

const StyledUser = styled.div`
    margin-top: 10px;
    display: flex;
    .user-avatar__friends {
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
