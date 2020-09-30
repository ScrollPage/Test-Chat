import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { addComment } from '@/store/actions/comment';
import { addCommentMutate } from '@/mutates/comment';

interface ICommentInput {
    postId: number;
    user: IUser;
}

const CommentInput: React.FC<ICommentInput> = ({ postId, user }) => {
    const dispatch = useDispatch();

    const [commentText, setCommentText] = useState('');
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
        if (commentText.trim() !== "") {
            const url = `/api/v1/comment/?post_id=${postId}`;
        addCommentMutate(commentText, postId, user, url);
        dispatch(addComment(commentText, user.userId, postId, null, url));
        setCommentText("");
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

const StyledCommentInput = styled.div`
    margin: 10px 0 20px 0;
    .comment__inner {
        display: flex;
        > div {
            &:first-of-type {
                margin-right: 20px;
                flex: 1;
            }
        }
    }
`;
