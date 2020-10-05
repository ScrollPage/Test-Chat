import { mutate } from 'swr';
import { IUser } from '@/types/user';
import { IPost } from '@/types/post';
import Cookie from 'js-cookie';

export const addPostMutate = (postText: string, mutatedImage: any, user: IUser, postUrl: string): void => {
  let addNewPost: IPost = {
    id: 0,
    image: mutatedImage,
    is_liked: false,
    is_watched: false,
    num_likes: 0,
    num_reposts: 0,
    num_reviews: 0,
    parent: null,
    text: postText,
    user: {
      id: user.userId,
      first_name: user.firstName,
      last_name: user.lastName,
      small_avatar: Cookie.get('smallAvatar')
    },
    group_owner: null,
    num_comments: 0,
    compressed_image: mutatedImage
  };
  console.log(Cookie.get('avatar'))
  mutate(postUrl, async (posts: IPost[]) => {
    if (posts) {
      return [addNewPost, ...posts];
    }
  }, false);
  console.log('post mutate');
};

export const addRepostMutate = (postText: string, mutatedImage: any, parent: IPost, user: IUser, postUrl: string): void => {
  let addNewPost: IPost = {
    id: 0,
    image: mutatedImage,
    is_liked: false,
    is_watched: false,
    num_likes: 0,
    num_reposts: 0,
    num_reviews: 0,
    parent: {
      id: parent.id,
      text: parent.text,
      image: parent.image,
      user: {
        id: parent.user.id,
        first_name: parent.user.first_name,
        last_name: parent.user.last_name,
        small_avatar: parent.user.small_avatar
      },
      parent: null,
      compressed_image: mutatedImage
    },
    text: postText,
    user: {
      id: user.userId,
      first_name: user.firstName,
      last_name: user.lastName,
      small_avatar: Cookie.get('smallAvatar')
    },
    group_owner: null,
    num_comments: 0,
    compressed_image: mutatedImage
  };
  mutate(postUrl, async (posts: IPost[]) => {
    if (posts) {
      return [addNewPost, ...posts];
    }
  }, false);
  console.log('post mutate');
};

// if (pageUserId === user.userId) {

