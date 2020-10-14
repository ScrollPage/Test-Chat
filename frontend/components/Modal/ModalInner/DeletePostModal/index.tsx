import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { deletePost } from '@/store/actions/post';
import { IPost } from '@/types/post';
import { StyledDeletePostModal } from './styles';

export interface IDeletePostModalProps {
    pageUserId: number | undefined;
    postId: number;
}

interface IDeletePostModal extends IDeletePostModalProps {
    setClose: () => void;
}

const DeletePostModal: React.FC<IDeletePostModal> = ({ pageUserId, postId, setClose }) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        setClose();
        let postUrl = '/api/v1/feed/';
        if (pageUserId) {
            postUrl = `/api/v1/post/?id=${pageUserId}`;
        }
        mutate(
            postUrl,
            async (posts: IPost[]) => {
                if (posts) {
                    return posts.filter(post => post.id !== postId);
                }
            },
            false
        );
        dispatch(deletePost(postId));
    };

    return (
        <StyledDeletePostModal>
            <h4>Вы дейтвительно хотите удалить пост?</h4>
            <Button
                type="primary"
                danger
                onClick={deleteHanlder}
            >
                Да
            </Button>
        </StyledDeletePostModal>
    );
};

export default DeletePostModal;


