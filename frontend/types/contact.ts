import { IContactUser } from '@/types/people';

export interface ITeam {
  id: number;
  image?: string;
  name: string;
  slug: string;
}

export interface IMyPage {
  id: number;
  friends: IContactUser[];
  parties: ITeam[];
}

export interface IContactInfo {
  id: number;
  status: string;
  birth_date: string | null;
  country: string;
  city: string;
}

export interface IContact {
  id: number;
  chat_id: number | null;
  is_friend: boolean;
  num_friends: number;
  num_notes: number;
  current_user: boolean;
  is_sent: boolean;
  is_sent_to_you: boolean;
  my_page: IMyPage;
  info: IContactInfo;
  email: string;
  slug: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_joined: string;
  last_login: string;
  avatar?: string;
  compressed_avatar?: string;
}