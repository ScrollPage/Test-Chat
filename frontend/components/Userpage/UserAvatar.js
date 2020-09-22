import React from 'react';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import {
  addFriend,
  removeAddFriend,
  removeFriend,
  createChat
} from '@/store/actions/friend';

const UserAvatar = ({ data, userId, chatId }) => {
  const dispatch = useDispatch();

  const { push } = useRouter();

  const addFriendHandler = () => {
    mutate(`/api/v1/contact/${userId}/`, { ...data, is_sent: true }, false);
    dispatch(addFriend(userId));
  };

  const removeAddFriendHandler = () => {
    mutate(`/api/v1/contact/${userId}/`, { ...data, is_sent: false }, false);
    dispatch(removeAddFriend(userId));
  };

  const removeFriendHandler = () => {
    mutate(
      `/api/v1/contact/${userId}/`,
      { ...data, is_friend: false, is_sent: false },
      false
    );
    dispatch(removeFriend(userId));
  };

  const chatIsNull = () => {
    if (chatId === null) {
      dispatch(createChat(userId));
    } else {
      push('/dialogs/[chatID]', `/dialogs/${chatId}`, { shallow: true });
    }
  };

  return (
    <StyledUserAvatar>
      <div>
        <Avatar
          style={{ backgroundColor: '#87d068' }}
          size={200}
          shape="square"
          icon={<UserOutlined />}
        />
        {Cookie.get('userId') !== userId && (
          <Button
            onClick={chatIsNull}
            type="primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Написать сообщение
          </Button>
        )}
        {Cookie.get('userId') !== userId ? (
          data.is_friend ? (
            <Button
              onClick={() => removeFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              danger
            >
              Удалить из друзей
            </Button>
          ) : data.is_sent ? (
            <Button
              onClick={() => removeAddFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              ghost
              danger
            >
              Отменить запрос
            </Button>
          ) : (
            <Button
              onClick={() => addFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              ghost
            >
              Добавить в друзья
            </Button>
          )
        ) : (
          <Button
            onClick={() =>
              push({ pathname: '/account-change' }, undefined, {
                shallow: true
              })}
            style={{ width: '100%', marginTop: '10px' }}
            type="primary"
            ghost
          >
            Сменить данные
          </Button>
        )}
      </div>
    </StyledUserAvatar>
  );
};

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
  @media (max-width: 900px) {
    margin-right: 0px;
  }
`;
