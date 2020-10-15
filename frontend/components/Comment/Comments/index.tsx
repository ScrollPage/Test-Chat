import React from 'react';
import CommentItem from '../CommentItem';
import useSWR from 'swr';
import { IComment } from '@/types/comment';
import Loading from '../../UI/Loading';
import { IUser } from '@/types/user';
import CommentInput from '../CommentInput';
import { StyledComments } from './styles';

interface IComments {
  postId: number;
  user: IUser;
  pageUserId?: number;
}

const Comments: React.FC<IComments> = ({ postId, user, pageUserId }) => {
  const { data: comments } = useSWR<IComment[]>(
    `/api/v1/comment/?post_id=${postId}`
  );

  const renderComments = (comments: Array<IComment>) => {
    return comments.map(comment => (
      <CommentItem
        key={`comment__key__${comment.id}`}
        userId={user.userId}
        comment={comment}
        postId={postId}
        pageUserId={pageUserId}
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


