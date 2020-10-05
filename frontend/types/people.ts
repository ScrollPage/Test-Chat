
export interface IContactUser {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
  avatar?: string;
}

export interface IGlobalUser extends IContactUser {
  chat_id: number | null;
}