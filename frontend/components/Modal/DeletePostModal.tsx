import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import NewModal from './NewModal';
import { useDispatch, useSelector } from 'react-redux';
import { getModalName, getModalProps } from '@/store/selectors';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { deletePost } from '@/store/actions/post';
import { IPost } from '@/types/post';

const DeleteCommentModal: React.FC = () => {
  const dispatch = useDispatch();

  const modalProps = useSelector(getModalProps);
  const modalName = useSelector(getModalName);

  const deleteHanlder = (modalProps: any) => {
    setClose();
    let postUrl = '/api/v1/feed/';
    if (modalProps.pageUserId) {
      postUrl = `/api/v1/post/?id=${modalProps.pageUserId}`;
    }
    mutate(
      postUrl,
      async (posts: IPost[]) => {
        if (posts) {
          return posts.filter(post => post.id !== modalProps.postId);
        }
      },
      false
    );
    dispatch(deletePost(modalProps.postId));
  };

  const setClose = () => {
    dispatch(modalHide());
  };

  return (
    <NewModal isOpen={modalName === 'post_modal'} setClose={setClose}>
      <StyledDeleteCommentModal>
        <h4>Вы дейтвительно хотите удалить пост?</h4>
        <Button type="primary" danger onClick={() => deleteHanlder(modalProps)}>
          Да
        </Button>
      </StyledDeleteCommentModal>
    </NewModal>
  );
};

export default DeleteCommentModal;

const StyledDeleteCommentModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h4 {
    margin-bottom: 20px;
  }
`;
