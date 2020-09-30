import { modalShow } from '@/store/actions/modal';
import { IComment } from '@/types/comment';
import { IUser } from '@/types/user';
import { renderTimestamp } from '@/utils';
import { CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LinkAvatar from '../UI/LinkAvatar';

interface ICommentFC {
  comment: IComment;
  userId: number;
  postId: number;
  pageUserId: number;
}

const Comment: React.FC<ICommentFC> = ({
  comment,
  userId,
  postId,
  pageUserId,
}) => {
  const dispatch = useDispatch();

  const deleteCommentHanlder = (commentId: number, postId: number) => {
    dispatch(modalShow('comment_modal', { commentId, postId, pageUserId }));
  };

  return (
    <StyledComment>
      <div
        className="comment__close"
        onClick={() => deleteCommentHanlder(comment.id, postId)}
      >
        <CloseOutlined />
      </div>
      <div className="comment__avatar">
        <LinkAvatar
          href="/userpage/[userID]"
          as={`/userpage/${comment.user.id}`}
          isUsername={comment.user.id === userId}
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
          <small>Ответить</small>
        </div>
      </div>
    </StyledComment>
  );
};

export default Comment;

const StyledComment = styled.div`
  display: flex;
  padding: 10px 0;
  position: relative;
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
