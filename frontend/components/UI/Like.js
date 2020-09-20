import React, { useState } from 'react';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import styled from 'styled-components';
import { addLike, removeLike } from '@/async/post.js';

const Like = ({isLiked, postId, setNumLikes}) => {

  const [like, setLike] = useState(isLiked);

  const setLikeHandler = () => {
    setLike(e => !e);
    if (like) {
      removeLike(postId);
      setNumLikes(e => e - 1);
    } else {
      addLike(postId);
      setNumLikes(e => e + 1);
    }
  }

  return (
    <StyledLike onClick={() => setLikeHandler()}>
      {like ? <HeartTwoTone twoToneColor="#eb2f96" style={{fontSize: '23px'}}/> : <HeartOutlined style={{fontSize: '23px'}}/>}
    </StyledLike>
  );
}

export default Like;

const StyledLike = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
