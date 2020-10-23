import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { IComment } from '@/types/comment';
import { deleteComment } from '@/store/actions/comment';
import { commentAmountMutate, deleteCommentMutate } from '@/mutates/comment';
import { StyledDeleteCommentModal } from './styles';
import { whereAreTheCommentLink, whereAreThePostLink } from '@/utils';

export interface IDeleteCommentModalProps {
    commentId: number;
    postId?: number;
    pageUserId?: number;
    partyId?: number;
    photoId?: number;
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
    photoId,
}) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        const commentUrl = whereAreTheCommentLink(postId, photoId);
        if (postId) {
            const postUrl = whereAreThePostLink(pageUserId, partyId);
            commentAmountMutate(postId, false, postUrl);
        }
        deleteCommentMutate(commentId, commentUrl);
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
