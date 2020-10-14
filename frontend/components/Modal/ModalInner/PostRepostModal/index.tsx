import React from 'react';
import PostCreate from '../../../Post/PostCreate';
import { IUser } from '@/types/user';
import { IPost } from '@/types/post';

export interface IPostRepostModalProps {
    pageUserId: number | undefined;
    user: IUser;
    parent: IPost;
}

interface IPostRepostModal extends IPostRepostModalProps {
    setClose: () => void;
}

const PostRepostModal: React.FC<IPostRepostModal> = ({ pageUserId, user, parent, setClose }) => {
    return (
        <PostCreate
            isRepost={true}
            pageUserId={pageUserId}
            user={user}
            parent={parent}
            setClose={setClose}
        />
    );
};

export default PostRepostModal;
