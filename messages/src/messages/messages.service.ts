import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(public messagesRepository: MessagesRepository) {}
  findAll() {
    return this.messagesRepository.findAll();
  }

  findOne(id: string) {
    return this.messagesRepository.findOne(id);
  }

  create(contents: string) {
    return this.messagesRepository.create(contents);
  }
}
