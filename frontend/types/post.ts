export interface IPostUser {
  id: number;
  first_name: string;
  last_name: string;
  slug?: string;
  avatar: string | null;
}

export interface IPostParent {
  id: number;
  user: IPostUser;
  owner?: number | null;
  parent: IPostParent | null;
  text: string;
  image: string | null;
  timestamp?: string;
}

export interface IPost {
  id: number;
  num_likes: number;
  timestamp?: string;
  num_reposts: number;
  is_liked: boolean;
  user: IPostUser;
  parent: IPostParent | null;
  is_watched: boolean;
  num_reviews: number;
  text: string;
  image: string | null;
  owner?: number | null;
  group_owner: number | null;
}

