import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

interface IDeletePostModal {
  deletePostMutate(): void;
}

const DeletePostModal: React.FC<IDeletePostModal> = ({deletePostMutate}) => {
  return (
    <StyledDeletePostModal>
      <h4>Вы дейтвительно хотите удалить пост?</h4>
      <Button
        type="primary"
        danger
        onClick={() => deletePostMutate()}
      >Да</Button>
    </StyledDeletePostModal>
  );
}

export default DeletePostModal;

const StyledDeletePostModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h4 {
    margin-bottom: 20px;
  }
`;
