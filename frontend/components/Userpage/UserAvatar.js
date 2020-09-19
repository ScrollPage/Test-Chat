import React, { useContext } from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Cookie from 'js-cookie';
import { FriendContext } from '@/context/friend/FriendContext';
import { mutate} from 'swr';
import { useRouter } from 'next/router';

const UserAvatar = ({ data, userId }) => {

  const { push } = useRouter();

  const { addFriend, removeAddFriend, removeFriend } = useContext(FriendContext);

  const addFriendHandler = () => {
    mutate(`/api/v1/contact/${userId}/`, { ...data, is_sent: true }, false);
    addFriend(userId);
  }

  const removeAddFriendHandler = () => {
    mutate(`/api/v1/contact/${userId}/`, { ...data, is_sent: false }, false);
    removeAddFriend(userId);
  }

  const removeFriendHandler = () => {
    mutate(`/api/v1/contact/${userId}/`, { ...data, is_friend: false, is_sent: false }, false);
    removeFriend(userId);
  }

  return (
    <StyledUserAvatar>
      <div>
        <Avatar style={{ backgroundColor: '#87d068' }} size={200} shape="square" icon={<UserOutlined />} />
        { Cookie.get('userId') !== userId && <Button type="primary" style={{ width: '100%', marginTop: '10px' }}>Написать сообщение</Button>}
        {Cookie.get('userId') !== userId
          ? data.is_friend
            ? <Button 
                onClick={() => removeFriendHandler()}
                style={{ width: '100%', marginTop: '10px' }}
                type="primary"
                danger
              >Удалить из друзей</Button>
            : data.is_sent
              ? <Button 
                  onClick={() => removeAddFriendHandler()}
                  style={{ width: '100%', marginTop: '10px' }}
                  type="primary"
                  ghost
                  danger
                >Отменить запрос</Button>
            : <Button
                onClick={() => addFriendHandler()}
                style={{ width: '100%', marginTop: '10px' }}
                type="primary"
                ghost
              >Добавить в друзья</Button>
          : <Button 
              onClick={() => push({ pathname: '/account-change' }, undefined, { shallow: true })}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              ghost
            >Сменить данные</Button>}
      </div>
    </StyledUserAvatar>
  );
}

export default UserAvatar;

const StyledUserAvatar = styled.div`
  margin-right: 20px;
  > div {
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    flex-direction: column;
    p {
      margin-top: 10px;
    }
  }
`;
