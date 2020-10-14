import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { deletePost } from '@/store/actions/post';
import { IPost } from '@/types/post';
import { StyledDeletePostModal } from './styles';
import { whereAreThePostLink } from '@/utils';
import { deletePostMutate } from '@/mutates/post';

export interface IDeletePostModalProps {
    pageUserId?: number;
    postId: number;
    partyId?: number;
}

interface IDeletePostModal extends IDeletePostModalProps {
    setClose: () => void;
}

const DeletePostModal: React.FC<IDeletePostModal> = ({ pageUserId, postId, setClose, partyId }) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        const postUrl = whereAreThePostLink(pageUserId, partyId);
        deletePostMutate(postId, postUrl);
        dispatch(deletePost(postId, postUrl));
        setClose();
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


