
export interface IContactUser {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
  avatar: string | null;
}

export interface IGlobalUser extends IContactUser {
  chat_id: number | null;
}