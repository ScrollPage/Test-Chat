export type IMessages = Array<IMessage>

export interface IMessage {
  author: number;
  content: string;
  first_name: string;
  id: number;
  last_name: string;
  timestamp: string;
}