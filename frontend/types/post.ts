export interface IPostUser {
  id: number;
  first_name: string;
  last_name: string;
  slug?: string;
  small_avatar?: string;
}

export interface IPostParent {
  id: number;
  user: IPostUser;
  owner?: number | null;
  parent: IPostParent | null;
  group_owner: IGroupOwner | null;
  text: string;
  image: string | null;
  timestamp?: string;
  compressed_image: string | null;
}

export interface IGroupOwner {
  id?: number;
  name: string;
  image?: string;
  slug?: string;
}

export interface IPost {
  id: number;
  num_likes: number;
  timestamp?: string;
  num_reposts: number;
  is_liked: boolean;
  user: IPostUser;
  group_owner: IGroupOwner | null;
  parent: IPostParent | null;
  is_watched: boolean;
  num_reviews: number;
  text: string;
  image: string | null;
  owner?: number | null;
  num_comments: number;
  compressed_image: string | null;
}

