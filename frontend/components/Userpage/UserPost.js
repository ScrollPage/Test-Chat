import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Like from '@/components/UI/Like';

const UserPost = ({ post }) => {
  const [numLikes, setNumLikes] = useState(post.num_likes);

  return (
    <StyledUserPost>
      <div className="user-post__header">
        <div>
          <Link href="/userpage/[userID]" as={`/userpage/${post.user.id}`}>
            <a>
              <Avatar style={{ marginRight: '15px' }} icon={<UserOutlined />} />
            </a>
          </Link>
        </div>
        <div>
          <Link href="/userpage/[userID]" as={`/userpage/${post.user.id}`}>
            <a>
              <p>
                {post.user.first_name} {post.user.last_name}
              </p>
            </a>
          </Link>
          <small>только что</small>
        </div>
      </div>
      {post.image && (
        <div className="user-post__body">
          <div>{post.text}</div>
          <div>
            <img src={post.image} alt="" />
          </div>
        </div>
      )}
      <div className="user-post__footer">
        <div>
          <Like
            isLiked={post.is_liked}
            postId={post.id}
            setNumLikes={setNumLikes}
          />
          <h2>{numLikes}</h2>
        </div>
      </div>
    </StyledUserPost>
  );
};

export default UserPost;

const StyledUserPost = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    > div {
      &:last-of-type {
        margin-top: 12px;
        img {
          max-width: 100%;
        }
      }
    }
  }
  .user-post__footer {
    margin-top: 20px;
    > div {
      &:first-of-type {
        display: flex;
        align-items: center;
        h2 {
          margin-bottom: 4px;
        }
      }
    }
  }
`;
