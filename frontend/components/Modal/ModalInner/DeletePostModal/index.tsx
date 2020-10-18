import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { modalHide } from '@/store/actions/modal';
import { mutate } from 'swr';
import { acceptPost, deletePost } from '@/store/actions/post';
import { IPost } from '@/types/post';
import { StyledDeletePostModal } from './styles';
import { whereAreThePostLink } from '@/utils';
import { deletePostMutate } from '@/mutates/post';

export interface IDeletePostModalProps {
    pageUserId?: number;
    postId: number;
    partyId?: number;
    isOffer?: boolean;
    isOfferConfirm?: boolean;
}

interface IDeletePostModal extends IDeletePostModalProps {
    setClose: () => void;
}

const DeletePostModal: React.FC<IDeletePostModal> = ({
    pageUserId,
    postId,
    setClose,
    partyId,
    isOffer,
    isOfferConfirm,
}) => {
    const dispatch = useDispatch();

    const deleteHanlder = () => {
        const postUrl = whereAreThePostLink(pageUserId, partyId, isOffer);
        deletePostMutate(postId, postUrl);
        if (isOfferConfirm && partyId) {
            dispatch(acceptPost(partyId, postId, postUrl));
        } else {
            dispatch(deletePost(postId, postUrl));
        }
        setClose();
    };

    return (
        <StyledDeletePostModal>
            {isOfferConfirm ? (
                <>
                    <h4>Вы дейтвительно хотите принять пост?</h4>
                    <Button type="primary" onClick={deleteHanlder}>
                        Да
                    </Button>
                </>
            ) : (
                <>
                    <h4>Вы дейтвительно хотите удалить пост?</h4>
                    <Button type="primary" danger onClick={deleteHanlder}>
                        Да
                    </Button>
                </>
            )}
        </StyledDeletePostModal>
    );
};

export default DeletePostModal;
