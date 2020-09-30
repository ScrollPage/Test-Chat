import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import NewModal from './NewModal';
import { useDispatch, useSelector } from 'react-redux';
import { getModalName, getModalProps } from '@/store/selectors';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { IComment } from '@/types/comment';
import { deleteComment } from '@/store/actions/comment';
import { commentAmountMutate } from '@/mutates/comment';

const DeleteCommentModal: React.FC = () => {
  const dispatch = useDispatch();

  const modalProps = useSelector(getModalProps);
  const modalName = useSelector(getModalName);

  const deleteHanlder = (modalProps: any) => {
    const commentUrl = `/api/v1/comment/?post_id=${modalProps.postId}`;
    const postUrl = `/api/v1/post/?id=${modalProps.pageUserId}`
    setClose();
    mutate(commentUrl, async (comments: IComment[]) => {
      return comments.filter(comment => comment.id !== modalProps.commentId)
    }, false);
    commentAmountMutate(modalProps.postId, false, postUrl)
    dispatch(deleteComment(modalProps.commentId));
  };

  const setClose = () => {
    dispatch(modalHide());
  };

  return (
    <NewModal isOpen={modalName === 'comment_modal'} setClose={setClose}>
      <StyledDeleteCommentModal>
        <h4>Вы дейтвительно хотите удалить комментарий?</h4>
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
