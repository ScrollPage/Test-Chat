import React, { useState } from 'react';
import styled from 'styled-components';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import Like from '@/components/UI/Like';
import Repost from '@/components/UI/Repost';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import ShowComment from '@/components/UI/ShowComment';
import Comments from '@/components/Comment/Comments';
import { useDispatch } from 'react-redux';
import { modalShow } from '@/store/actions/modal';
import UserPostBody from './UserPostBody';

interface IUserPost {
  post: IPost;
  user: IUser;
  pageUserId?: number;
}

const UserPost: React.FC<IUserPost> = ({
  post,
  user,
  pageUserId,
}) => {
  const dispatch = useDispatch();

  const [isCommentsOpen, setIsCommentsOpen] = useState<number | null>(null);

  const deletePostHanlder = (postId: number, pageUserId?: number) => {
    dispatch(modalShow('post_modal', { pageUserId, postId }));
  };

  return (
    <StyledUserPost>
      {(post.user.id === user.userId || pageUserId === user.userId) && (
        <div
          className="user-post__close"
          onClick={() => deletePostHanlder(post.id, pageUserId)}
        >
          <CloseOutlined />
        </div>
      )}
      <UserPostBody user={user} postOrParent={post} isParent={false} />
      {post.parent && (
        <>
          <hr />
          <UserPostBody
            user={user}
            postOrParent={post.parent}
            isParent={true}
          />
        </>
      )}
      <div className="user-post__footer">
        <div>
          <Like
            isTap={post.is_liked}
            postId={post.id}
            pageUserId={pageUserId}
          />
          <h2>{post.num_likes}</h2>
        </div>
        <div>
          <Repost post={post} pageUserId={pageUserId} user={user} />
          <h2>{post.num_reposts}</h2>
        </div>
        <div>
          <ShowComment
            postId={post.id}
            setIsCommentsOpen={setIsCommentsOpen}
            isCommentsOpen={isCommentsOpen}
          />
          <h2>{post.num_comments}</h2>
        </div>
      </div>
      <hr />
      {isCommentsOpen && (
        <Comments user={user} postId={isCommentsOpen} pageUserId={pageUserId} />
      )}
    </StyledUserPost>
  );
};

export default UserPost;

const StyledUserPost = styled.div`
  padding: 20px;
  padding-bottom: 0px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  position: relative;
  .user-post {
    display: flex;
  }
  .user-post__close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  hr {
    background-color: #fff;
    border: 2px solid #fff;
    width: calc(100% + 38px);
    margin-left: -20px;
    &:first-of-type {
      margin-top: 30px;
      margin-bottom: 20px;
    }
    &:last-of-type {
      margin-bottom: 0px;
    }
  }
  .user-post__header {
    display: flex;
    justify-content: flex-start;
    > div {
      &:first-of-type {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:last-of-type {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        a {
          color: black;
        }
        p {
          margin-bottom: 0;
          font-weight: 600;
        }
        small {
          opacity: 0.6;
        }
      }
    }
  }
  .user-post__body {
    display: flex;
    flex-direction: column;
    > div {
      margin-top: 12px;
      img {
        max-width: 100%;
      }
    }
  }
  .user-post__footer {
    margin-top: 20px;
    display: flex;
    > div {
      display: flex;
      align-items: center;
      h2 {
        margin-bottom: 4px;
      }
    }
  }
  .user-post__avatar {
    margin-right: 10px;
  }
`;
