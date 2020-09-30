import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

interface IDeleteModal {
  deletePostMutate?: () => void;
  deleteCommentMutate?: () => void;
}

const DeleteModal: React.FC<IDeleteModal> = ({ deletePostMutate, deleteCommentMutate }) => {
  
  const deleteHanlder = () => {
    if (deletePostMutate) {
      deletePostMutate();
    }
    if (deleteCommentMutate) {
      deleteCommentMutate()
    }
  }

  return (
    <StyledDeleteModal>
      <h4>{deletePostMutate ? 'Вы дейтвительно хотите удалить пост?' : 'Вы дейтвительно хотите удалить комментарий?'}</h4>
      <Button
        type="primary"
        danger
        onClick={() => deleteHanlder()}
      >Да</Button>
    </StyledDeleteModal>
  );
}

export default DeleteModal;

const StyledDeleteModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h4 {
    margin-bottom: 20px;
  }
`;
