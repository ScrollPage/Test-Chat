import React from 'react';
import { NotificationOutlined } from '@ant-design/icons';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { modalShow } from '@/store/actions/modal';
import { IPostRepostModalProps } from '@/components/Modal/ModalInner/PostRepostModal';
import { StyledRepost } from './styles';

interface IRepost {
  post: IPost;
  user: IUser;
  pageUserId?: number;
}

const Repost: React.FC<IRepost> = ({ post, pageUserId, user }) => {
  const dispatch = useDispatch();

  const addRepostHandler = (post: IPost, user: IUser, pageUserId?: number) => {
    dispatch(modalShow<IPostRepostModalProps>('POST_REPOST_MODAL', { parent: post, pageUserId, user }));
  };

  return (
    <StyledRepost>
      <NotificationOutlined
        style={{ fontSize: '23px' }}
        onClick={() => addRepostHandler(post, user, pageUserId)}
      />
    </StyledRepost>
  );
};

export default Repost;
