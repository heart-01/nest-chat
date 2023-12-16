import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [{ name: 'john', text: 'hello' }];
  clientToUser = {};

  identifyUser(name: string, clientId: string) {
    this.clientToUser[clientId] = name; // Map the client to the user
    return Object.values(this.clientToUser); // Return all the users
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
    };
    this.messages.push(message);
    return message;
  }

  findAll(): Message[] {
    return this.messages;
  }
}
