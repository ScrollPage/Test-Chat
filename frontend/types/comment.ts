export interface ICommentUser {
  id: number;
  first_name: string;
  last_name: string;
  slug?: string;
  avatar?: string | null;
}

export interface IComment {
  id: number;
  timestamp?: string;
  user: ICommentUser;
  children: Array<IComment> | [];
  text: string;
  image: string | null;
  parent: number | null;
  post_id: number;
}