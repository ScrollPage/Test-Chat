import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { IComment } from '@/types/comment';
import { deleteComment } from '@/store/actions/comment';
import { commentAmountMutate } from '@/mutates/comment';
import { StyledDeleteCommentModal } from './styles';

export interface IDeleteCommentModalProps {
    commentId: number;
    postId: number;
    pageUserId?: number;
}

interface IDeleteCommentModal extends IDeleteCommentModalProps {
    setClose: () => void;
}

const DeleteCommentModal: React.FC<IDeleteCommentModal> = ({
    postId,
    pageUserId,
    commentId,
    setClose,
}) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        const commentUrl = `/api/v1/comment/?post_id=${postId}`;
        let postUrl = '/api/v1/feed/';
        if (pageUserId) {
            postUrl = `/api/v1/post/?id=${pageUserId}`;
        }
        setClose();
        mutate(
            commentUrl,
            async (comments: IComment[]) => {
                if (comments) {
                    return comments.filter(comment => comment.id !== commentId);
                }
            },
            false
        );
        commentAmountMutate(postId, false, postUrl);
        dispatch(deleteComment(commentId));
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
