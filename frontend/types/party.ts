import { IPostUser } from './post';

export interface IPartyMember {
  id: number;
  user: IPostUser;
}

export interface IParty {
  id: number;
  staff: [];
  members: IPartyMember[];
  admin: IPostUser;
  num_members: number;
  joined: boolean;
  image?: string;
  compressed_image?: string;
  small_image?: string;
  name: string;
  slug: string;
  info: string;
  created: string;
}