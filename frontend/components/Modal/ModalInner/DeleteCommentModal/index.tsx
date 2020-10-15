import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { IComment } from '@/types/comment';
import { deleteComment } from '@/store/actions/comment';
import { commentAmountMutate, deleteCommentMutate } from '@/mutates/comment';
import { StyledDeleteCommentModal } from './styles';
import { whereAreThePostLink } from '@/utils';

export interface IDeleteCommentModalProps {
    commentId: number;
    postId: number;
    pageUserId?: number;
    partyId?: number;
}

interface IDeleteCommentModal extends IDeleteCommentModalProps {
    setClose: () => void;
}

const DeleteCommentModal: React.FC<IDeleteCommentModal> = ({
    postId,
    pageUserId,
    commentId,
    setClose,
    partyId,
}) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        const commentUrl = `/api/v1/comment/?post_id=${postId}`;
        const postUrl = whereAreThePostLink(pageUserId, partyId);
        deleteCommentMutate(commentId, commentUrl)
        commentAmountMutate(postId, false, postUrl);
        dispatch(deleteComment(commentId));
        setClose();
    };

    return (
        <StyledDeleteCommentModal>
            <h4>Вы дейтвительно хотите удалить комментарий?</h4>
            <Button type="primary" danger onClick={deleteHanlder}>
                Да
            </Button>
        </StyledDeleteCommentModal>
    );
};

export default DeleteCommentModal;
