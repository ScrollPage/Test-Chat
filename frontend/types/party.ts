import { IGroupOwner, IPostUser } from './post';

export interface IPartyMember {
  id: number;
  user: IPostUser;
}

export interface IParty extends IGroupOwner {
  staff: IPostUser[];
  members: IPartyMember[];
  admin: IPostUser;
  num_members: number;
  joined: boolean;
  compressed_image?: string;
  small_image?: string;
  info: string;
  created: string;
}