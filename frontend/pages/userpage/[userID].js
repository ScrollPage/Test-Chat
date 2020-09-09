import PrivateLayout from '@/components/Layout/PrivateLayout';
import styled from 'styled-components';
import axios from 'axios';
import cookies from 'next-cookies';
import useSWR from 'swr';
import UserInfo from '@/components/Userpage/UserInfo';
import UserAvatar from '@/components/Userpage/UserAvatar';
import UserFriends from '@/components/Userpage/UserFriends';

export default function Teams({ user, userId }) {

  const { data } = useSWR(`/api/v1/contact/${userId}`, { initialData: user });

  return (
    <PrivateLayout>
      <StyledUser>
        <div>
          <UserAvatar data={data} userId={userId}/>
          <div className="user-avatar__friends">
            <h4>Друзья: {`(${data.num_friends})`}</h4>
            <UserFriends friends={data.friends}/>
          </div>
        </div>
        <UserInfo data={data} />
      </StyledUser>
    </PrivateLayout>
  );
}

export const getServerSideProps = async (ctx) => {

  const userId = ctx.params.userID;
  const token = cookies(ctx)?.token || null;

  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`
  };

  let user = null;

  await axios
    .get(`/api/v1/contact/${userId}`)
    .then((response) => {
      user = response?.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return {
    props: {
      user: user,
      userId: userId
    }
  };
}

const StyledUser = styled.div`
  display: flex;
  .user-avatar__friends {
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    margin-top: 20px;
    padding: 10px;
  }
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

