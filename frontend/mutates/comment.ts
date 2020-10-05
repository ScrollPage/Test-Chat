import { IPost } from '@/types/post';
import { IComment, ICommentUser } from '@/types/comment';
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
    if (comments) {
      return [...comments, newComment];
    }
  }, false);
};

export const addReCommentMutate = (commentText: string, parent: number, user: IUser, url: string): void => {
  mutate(url, async (comments: IComment[]) => {
    if (comments) {
      let newComments = [...comments];
      const index = comments.findIndex(comment => comment.id === parent);
      const newComment = {
        id: 0,
        user: {
          id: user.userId,
          first_name: user.firstName,
          last_name: user.lastName
        },
        children: [],
        text: commentText,
        image: null,
        parent: parent,
        post_id: newComments[index].post_id,
      }
      newComments[index] = {
        ...comments[index],
        children: [...comments[index].children, newComment]
      }
    }
  }, false);
};

export const commentAmountMutate = (postId: number, isAdd: boolean, url: string) => {
  if (isAdd) {
    mutate(url, async (posts: IPost[]) => {
      if (posts) {
        let newPosts = [...posts];
        const index = posts.findIndex(post => post.id === postId);
        newPosts[index] = {
          ...posts[index],
          num_comments: posts[index].num_comments + 1,
        };
        return newPosts
      }
    }, false);
  } else {
    mutate(url, async (posts: IPost[]) => {
      if (posts) {
        let newPosts = [...posts];
        const index = posts.findIndex(post => post.id === postId);
        newPosts[index] = {
          ...posts[index],
          num_comments: posts[index].num_comments - 1,
        };
        return newPosts
      }
    }, false);
  }
}