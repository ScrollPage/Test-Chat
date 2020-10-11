import React from 'react';
import styled from 'styled-components';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { mutate } from 'swr';
import { IPost } from '@/types/post';
import { useDispatch } from 'react-redux';
import { addPostLike, removePostLike } from '@/store/actions/post';

interface ILike {
  isTap: boolean;
  postId: number;
  pageUserId?: number;
}

const Like: React.FC<ILike> = ({ isTap, postId, pageUserId }) => {
  const dispatch = useDispatch();

  const likeMutate = (postId: number): void => {
    let postUrl = '/api/v1/feed/';
    if (pageUserId) {
      postUrl = `/api/v1/post/?id=${pageUserId}`;
    }
    mutate(
      postUrl,
      async (posts: IPost[]) => {
        const index = posts.findIndex(post => post.id === postId);
        let newPosts = [...posts];
        if (posts[index].is_liked) {
          newPosts[index] = {
            ...posts[index],
            is_liked: false,
            num_likes: posts[index].num_likes - 1,
          };
          dispatch(removePostLike(postId));
          return newPosts;
        } else {
          newPosts[index] = {
            ...posts[index],
            is_liked: true,
            num_likes: posts[index].num_likes + 1,
          };
          dispatch(addPostLike(postId));
          return newPosts;
        }
      },
      false
    );
  };

  return (
    <StyledLike onClick={() => likeMutate(postId)}>
      {isTap ? (
        <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '23px' }} />
      ) : (
        <HeartOutlined style={{ fontSize: '23px' }} />
      )}
    </StyledLike>
  );
};

export default Like;

const StyledLike = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
