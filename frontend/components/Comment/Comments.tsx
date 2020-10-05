import React, { useState } from 'react';
import Comment from './Comment';
import useSWR from 'swr';
import { IComment, ICommentUser } from '@/types/comment';
import Loading from '../UI/Loading';
import { IUser } from '@/types/user';
import CommentInput from './CommentInput';
import styled from 'styled-components';

interface ICommentFC {
  postId: number;
  user: IUser;
  pageUserId?: number;
}

const Comments: React.FC<ICommentFC> = ({ postId, user, pageUserId }) => {
  const { data: comments } = useSWR<IComment[]>(
    `/api/v1/comment/?post_id=${postId}`
  );

  const commentAnswerHandler = (
    commentUser: ICommentUser,
    commentId: number
  ) => {};

  const renderComments = (comments: Array<IComment>) => {
    return comments.map(comment => (
      <Comment
        key={`comment__key__${comment.id}`}
        userId={user.userId}
        comment={comment}
        postId={postId}
        pageUserId={pageUserId}
        commentAnswerHandler={commentAnswerHandler}
      />
    ));
  };

  return (
    <StyledComments>
      {comments ? (
        comments.length === 0 ? (
          <h4>Нет комментариев</h4>
        ) : (
          renderComments(comments)
        )
      ) : (
        <div className="comments__loading">
          <Loading />
        </div>
      )}
      <CommentInput pageUserId={pageUserId} postId={postId} user={user} />
    </StyledComments>
  );
};

export default Comments;

const StyledComments = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .comments__loading {
    height: 28.6px;
  }
`;
