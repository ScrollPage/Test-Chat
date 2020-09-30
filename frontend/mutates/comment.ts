import { IPost } from '@/types/post';
import { IComment } from '@/types/comment';
import { IUser } from '@/types/user';
import { mutate } from 'swr';

export const addCommentMutate = (commentText: string, postId: number, user: IUser, url: string): void => {
  const newComment: IComment = {
    id: 0,
    user: {
      id: user.userId,
      first_name: user.firstName,
      last_name: user.lastName,
    },
    children: [],
    text: commentText,
    image: null,
    parent: null,
    post_id: postId,
  };
  mutate(url, async (comments: IComment[]) => {
    return [...comments, newComment];
  }, false);
};


export const commentAmountMutate = (postId: number, isAdd: boolean, url: string) => {
  if (isAdd) {
    mutate(url, async (posts: IPost[]) => {
      let newPosts = [...posts];
      const index = posts.findIndex(post => post.id === postId);
      newPosts[index] = {
        ...posts[index],
        num_comments: posts[index].num_comments + 1,
      };
    }, false);
  } else {
    mutate(url, async (posts: IPost[]) => {
      let newPosts = [...posts];
      const index = posts.findIndex(post => post.id === postId);
      newPosts[index] = {
        ...posts[index],
        num_comments: posts[index].num_comments - 1,
      };
    }, false);
  }
}