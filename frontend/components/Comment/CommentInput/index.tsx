import { StyledCommentInput } from './styles';
import { SendOutlined } from '@ant-design/icons';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { addComment } from '@/store/actions/comment';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { addCommentMutate, commentAmountMutate } from '@/mutates/comment';

interface ICommentInput {
    postId: number;
    user: IUser;
    pageUserId?: number;
}

const CommentInput: React.FC<ICommentInput> = ({
    postId,
    user,
    pageUserId,
}) => {
    const dispatch = useDispatch();

    const [commentText, setCommentText] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (commentText.trim() !== '') {
            const commentUrl = `/api/v1/comment/?post_id=${postId}`;
            let postUrl = '/api/v1/feed/';
            if (pageUserId) {
                postUrl = `/api/v1/post/?id=${pageUserId}`;
            }
            addCommentMutate(commentText, postId, user, commentUrl);
            commentAmountMutate(postId, true, postUrl);
            dispatch(addComment(commentText, postId, commentUrl));
            setCommentText('');
        }
    };

    return (
        <StyledCommentInput>
            <form onSubmit={handleSubmit}>
                <div className="comment__inner">
                    <div>
                        <Input
                            id="create_comment"
                            name="create_comment"
                            placeholder={'Введите комментарий...'}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            autoFocus={true}
                        />
                    </div>
                    <div>
                        <Button htmlType="submit">
                            <SendOutlined />
                        </Button>
                    </div>
                </div>
            </form>
        </StyledCommentInput>
    );
};

export default CommentInput;
