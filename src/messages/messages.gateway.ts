import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Socket) {
    console.log('Socket is live');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('User connected');
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected');
  }

  @SubscribeMessage('createMessage')
  async handleEventCreate(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    this.server.emit('message', message); // Emit the message to all clients
    return message;
  }

  @SubscribeMessage('findAllMessages')
  handleEventFindAll(): Message[] {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  handleEventJoinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.identifyUser(name, client.id);
  }

  @SubscribeMessage('typeing')
  async handleEventTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.messagesService.getClientName(client.id);
    client.broadcast.emit('typeing', { name, isTyping });
  }
}
