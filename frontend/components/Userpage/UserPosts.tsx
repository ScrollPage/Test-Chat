import React, { useState } from 'react';
import UserPost from './UserPost';
import PostCreate from './PostCreate';
import useSWR from 'swr';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';

interface IUserPosts {
  serverPosts: IPost[];
  pageUserId: number;
  user: IUser;
}

const UserPosts: React.FC<IUserPosts> = ({ serverPosts, pageUserId, user }) => {
  const { data: posts = [] } = useSWR<IPost[]>(
    `/api/v1/post/?id=${pageUserId}`,
    { initialData: serverPosts }
  );

  const renderPosts = (posts: Array<IPost>) => {
    return posts.map(post => (
      <UserPost
        key={`post__key__${post.id}`}
        user={user}
        post={post}
        pageUserId={pageUserId}
      />
    ));
  };

  return (
    <>
      {posts && (
        <>
          <PostCreate isRepost={false} pageUserId={pageUserId} user={user} />
          <div style={{ marginTop: '20px' }}>
            {posts ? (
              posts.length === 0 ? (
                <h2>Нет постов</h2>
              ) : (
                renderPosts(posts)
              )
            ) : (
              'Загрузка'
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserPosts;
