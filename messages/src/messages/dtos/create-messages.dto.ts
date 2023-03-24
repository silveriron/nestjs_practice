import { IsString } from 'class-validator';

export class MessagesDTO {
  @IsString()
  content: string;
}
