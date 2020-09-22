import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { addLike, removeLike } from '@/store/actions/post';

const Like = ({ isLiked, postId, setNumLikes }) => {
  const dispatch = useDispatch();

  const [like, setLike] = useState(isLiked);

  const setLikeHandler = () => {
    setLike(e => !e);
    if (like) {
      dispatch(removeLike(postId));
      setNumLikes(e => e - 1);
    } else {
      dispatch(addLike(postId));
      setNumLikes(e => e + 1);
    }
  };

  return (
    <StyledLike onClick={() => setLikeHandler()}>
      {like ? (
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
