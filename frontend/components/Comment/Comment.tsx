import { modalShow } from '@/store/actions/modal';
import { IComment, ICommentUser } from '@/types/comment';
import { renderTimestamp } from '@/utils';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LoadImage from '../UI/LoadImage';

interface ICommentFC {
  comment: IComment;
  userId: number;
  postId: number;
  pageUserId?: number;
  commentAnswerHandler: (commentUser: ICommentUser, commentId: number) => void;
}

export interface IDeleteCommentModal {
  commentId: number;
  postId: number;
  pageUserId?: number;
}

const Comment: React.FC<ICommentFC> = ({
  comment,
  userId,
  postId,
  pageUserId,
  commentAnswerHandler,
}) => {
  const dispatch = useDispatch();

  const deleteCommentHanlder = (commentId: number, postId: number) => {
    dispatch(
      modalShow<IDeleteCommentModal>('comment_modal', {
        commentId,
        postId,
        pageUserId,
      })
    );
  };

  const renderCommentChildren = (comments: IComment[]) => {
    return comments.map(comment => {
      return (
        <StyledCommentChildren>
          <RollbackOutlined
            style={{ fontSize: '20px', marginTop: '14px', marginRight: '13px' }}
          />
          <Comment
            key={`comment__key__${comment.id}`}
            comment={comment}
            userId={userId}
            postId={postId}
            pageUserId={pageUserId}
            commentAnswerHandler={commentAnswerHandler}
          />
        </StyledCommentChildren>
      );
    });
  };

  return (
    <>
      <StyledComment>
        {userId === comment.user.id && (
          <div
            className="comment__close"
            onClick={() => deleteCommentHanlder(comment.id, postId)}
          >
            <CloseOutlined />
          </div>
        )}
        <div className="comment__avatar">
          <LoadImage
            href="/userpage/[userID]"
            as={`/userpage/${comment.user.id}`}
            size={'30'}
            src={comment.user?.small_avatar && comment.user?.small_avatar}
            isCircle={true}
          />
        </div>
        <div className="comment__inner">
          <h4>{`${comment.user.first_name} ${comment.user.last_name}`}</h4>
          <span>{comment.text}</span>
          <div>
            <small>
              {comment?.timestamp
                ? renderTimestamp(comment.timestamp)
                : 'только что...'}
            </small>
            <small
              onClick={() => commentAnswerHandler(comment.user, comment.id)}
            >
              Ответить
            </small>
          </div>
        </div>
      </StyledComment>
      <div className="comment__children">
        {comment?.children && renderCommentChildren(comment.children)}
      </div>
    </>
  );
};

export default Comment;

const StyledCommentChildren = styled.div`
  display: flex;
`;

const StyledComment = styled.div`
  display: flex;
  padding: 10px 0;
  position: relative;
  flex: 1;
  .comment {
    &__close {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      font-size: 10px;
    }
    &__avatar {
      margin-right: 10px;
    }
    &__inner {
      display: flex;
      flex-direction: column;
      h4 {
        margin-bottom: 0;
        margin-top: -4px;
      }
      small {
        &:first-of-type {
          margin-right: 10px;
          opacity: 0.6;
        }
        &:last-of-type {
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }
`;
