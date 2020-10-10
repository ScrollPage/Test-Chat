export interface IChatMessageContact {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
}

export interface IChatMessage {
  id: number;
  contact: IChatMessageContact;
  content: string;
  timestamp: string;
}

export interface IChatParticipiant {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
  small_avatar?: string; 
}

export interface IChat {
  id: number;
  messages: Array<IChatMessage>;
  participants: Array<IChatParticipiant>;
}

export interface IChatInfo {
  id: number;
  participants: IChatParticipiant[];
  companion: IChatParticipiant;
}