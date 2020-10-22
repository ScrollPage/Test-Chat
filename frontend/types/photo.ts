import { IPostUser } from '@/types/post';

export interface IPhoto {
  id: number,
  timestamp: string,
  small_picture: string,
  compressed_picture: string,
  picture: string,
  owner: {
    user: IPostUser
  },
  num_likes: number,
  num_comments: number
}