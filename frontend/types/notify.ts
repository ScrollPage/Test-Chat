import { IPostUser } from '@/types/post';
export interface INewRequest {
  sender: number;
  name: string;
}

export interface INewLike {
  liker: number;
  type: 'comment' | 'post' | 'photo';
  id: number;
  name: string;
}

export interface INewMessage {
  name: string;
  sender: number;
  chat_id: number;
}

export interface INewFriend {
  sender: number;
  name: string;
} 

export interface INewRepost {
  reposter: number;
  post: number;
  name: string;
}

export interface INotifyItem {
  sender: IPostUser;
  event: 1 | 2 | 3 | 4 | 5;
  seen: boolean;
}

