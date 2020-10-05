import React from 'react';
import styled from 'styled-components';
import { NotificationOutlined } from '@ant-design/icons';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { modalShow } from '@/store/actions/modal';

interface IRepost {
  post: IPost;
  user: IUser;
  pageUserId?: number;
}

const Repost: React.FC<IRepost> = ({ post, pageUserId, user }) => {
  const dispatch = useDispatch();

  const addRepostHandler = (post: IPost, user: IUser, pageUserId?: number) => {
    dispatch(modalShow('repost_modal', { parent: post, pageUserId, user }));
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

const StyledRepost = styled.div`
  margin-left: 20px;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
