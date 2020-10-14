import React from 'react';
import PostCreate from '../../../Post/PostCreate';
import { IUser } from '@/types/user';
import { IPost } from '@/types/post';

export interface IPostRepostModalProps {
    user: IUser;
    parent: IPost;
    pageUserId?: number;
    partyId?: number;
}

interface IPostRepostModal extends IPostRepostModalProps {
    setClose: () => void;
}

const PostRepostModal: React.FC<IPostRepostModal> = ({ pageUserId, user, parent, setClose, partyId }) => {
    return (
        <PostCreate
            isRepost={true}
            pageUserId={pageUserId}
            user={user}
            parent={parent}
            setClose={setClose}
            partyId={partyId}
        />
    );
};

export default PostRepostModal;
