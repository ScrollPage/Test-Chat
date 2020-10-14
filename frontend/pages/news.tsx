import PrivateLayout from '@/components/Layout/PrivateLayout';
import UserPost from '@/components/Post/PostItem';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { getUserFromServer } from '@/utils/index';
import { instanceWithSSR } from '@/api/api';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import styled from 'styled-components';
import PostCreate from '@/components/Post/PostCreate';

interface INews {
  user: IUser;
  serverPosts: IPost[];
}

export default function News({ user, serverPosts }: INews) {
  const { data: posts = [] } = useSWR<IPost[]>('/api/v1/feed/', {
    initialData: serverPosts,
  });

  const renderPosts = (posts: Array<IPost>) => {
    return posts.map(post => (
      <UserPost key={`post__key__${post.id}`} user={user} post={post} />
    ));
  };

  return (
    <PrivateLayout user={user}>
      <StyledNews>
      <div className="news__create">
        <PostCreate isRepost={false} user={user} />
      </div>
        {posts ? (
          posts.length === 0 ? (
            <p>Нет постов</p>
          ) : (
            renderPosts(posts)
          )
        ) : (
          <p>Загрузка...</p>
        )}
      </StyledNews>
    </PrivateLayout>
  );
}

export const getServerSideProps: GetServerSideProps<INews> = async ctx => {
  let posts: Array<IPost> = [];

  await instanceWithSSR(ctx)
    .get(`/api/v1/feed/`)
    .then(response => {
      posts = response?.data;
    })
    .catch(error => {
      console.log(error);
    });
  return {
    props: {
      user: getUserFromServer(ctx),
      serverPosts: posts,
    },
  };
};

const StyledNews = styled.div`
  margin-top: 20px;
  max-width: 500px;
  .news__create {
    margin-bottom: 20px;
  }
`;
