import React from 'react';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  addFriend,
  removeAddFriend,
  removeFriend,
  createChat,
  recieveFriend,
} from '@/store/actions/friend';
import { IContact } from '@/types/contact';
import { IUser } from '@/types/user';
import { modalShow } from '@/store/actions/modal';
import LoadImage from '../../UI/Image/LoadImage';
import { IChangeAvatarModalProps } from '../../Modal/ModalInner/ChangeAvatarModal';
import { StyledUserAvatar } from './styles';

interface IUserAvatar {
  contact: IContact;
  pageUserId: number;
  chatId: number | null;
  user: IUser;
}

const UserAvatar: React.FC<IUserAvatar> = ({
  contact,
  pageUserId,
  chatId,
  user,
}) => {
  const dispatch = useDispatch();

  const { push } = useRouter();

  const addFriendHandler = (): void => {
    mutate(
      `/api/v1/contact/${pageUserId}/`,
      { ...contact, is_sent: true },
      false
    );
    dispatch(addFriend(pageUserId));
  };

  const removeAddFriendHandler = (): void => {
    mutate(
      `/api/v1/contact/${pageUserId}/`,
      { ...contact, is_sent: false },
      false
    );
    dispatch(removeAddFriend(pageUserId, user.userId));
  };

  const removeFriendHandler = (): void => {
    mutate(
      `/api/v1/contact/${pageUserId}/`,
      { ...contact, is_friend: false, is_sent: false },
      false
    );
    dispatch(removeFriend(pageUserId, user.userId));
  };

  const recieveFriendHandler = () => {
    mutate(
      `/api/v1/contact/${pageUserId}/`,
      { ...contact, is_friend: true, is_sent: false, is_sent_to_you: false },
      false
    );
    dispatch(recieveFriend(pageUserId, user.userId));
  };

  const chatIsNull = () => {
    if (!chatId) {
      dispatch(createChat(pageUserId));
    } else {
      push('/dialogs/[chatID]', `/dialogs/${chatId}`, { shallow: true });
    }
  };

  const changeAvatarHandler = () => {
    if (pageUserId === user.userId) {
      dispatch(
        modalShow<IChangeAvatarModalProps>('AVATAR_CHANGE_MODAL', { userId: user.userId })
      );
    }
  };

  return (
    <StyledUserAvatar isHover={pageUserId === user.userId}>
      <div>
        <div className="user-avatar__image">
          {contact.avatar && contact.compressed_avatar ? (
            <LoadImage size={'200'} src={contact.avatar} isCircle={false} />
          ) : (
            <Avatar
              style={{ backgroundColor: '#87d068' }}
              size={200}
              shape="square"
              icon={<UserOutlined />}
            />
          )}
          <div
            className="user-avatar__hover"
            onClick={() => changeAvatarHandler()}
          >
            Обновить фотографию
          </div>
        </div>
        {user.userId !== pageUserId && (
          <Button
            onClick={chatIsNull}
            type="primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Написать сообщение
          </Button>
        )}
        {user.userId !== pageUserId ? (
          contact.is_friend ? (
            <Button
              onClick={() => removeFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              danger
            >
              Удалить из друзей
            </Button>
          ) : contact.is_sent ? (
            <Button
              onClick={() => removeAddFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              ghost
              danger
            >
              Отменить запрос
            </Button>
          ) : contact.is_sent_to_you ? (
            <Button
              onClick={() => recieveFriendHandler()}
              style={{ width: '100%', marginTop: '10px' }}
              type="primary"
              ghost
            >
              Принять заявку в друзья
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
                shallow: true,
              })
            }
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