import React from 'react';
import styled from 'styled-components';
import { MessageOutlined } from '@ant-design/icons';

interface IShowComment {
  setIsCommentsOpen: (postId: number | null) => void;
  postId: number;
  isCommentsOpen: number | null;
}

const ShowComment: React.FC<IShowComment> = ({ postId, setIsCommentsOpen, isCommentsOpen }) => {
  
  const setIsCommentsOpenHandler = (): void => {
    if (isCommentsOpen === null) {
      setIsCommentsOpen(postId);
    } else {
      setIsCommentsOpen(null);
    }
  }

  return (
    <StyledShowComment>
      <MessageOutlined
        style={{ fontSize: '23px' }}
        onClick={() => setIsCommentsOpenHandler()}
      />
    </StyledShowComment>
  );
}

export default ShowComment;

const StyledShowComment = styled.div`
  margin-left: 20px;
    margin-right: 10px;
    &:hover {
        cursor: pointer;
    }
`;
