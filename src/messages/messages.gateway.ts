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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotifyChatRoomCreatedEvent } from 'src/notify/dto/notify-chat-room-created.event';

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
  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Socket) {
    console.log('Socket is live');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`User ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User ${client.id} disconnected`);
  }

  @SubscribeMessage('createMessage')
  async handleEventCreate(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(
      createMessageDto,
      client.id,
    );
    this.server.emit('message', message); // call the event 'message' and send the message on the all clients
    return message;
  }

  @SubscribeMessage('findAllMessages')
  handleEventFindAll(): Message[] {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  async handleEventJoinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.eventEmitter.emit('user.joined', new NotifyChatRoomCreatedEvent(name, client.id)); // call the internal event 'user.joined' in the NotifyService
    const result = await this.eventEmitter.emitAsync('ads.enabled', true); // call the internal event 'ads.enabled' in the AdsService
    console.log(result); // [1, 2]
    return this.messagesService.identifyUser(name, client.id);
  }

  @SubscribeMessage('typeing')
  async handleEventTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.messagesService.getClientName(client.id);
    client.broadcast.emit('typeing', { name, isTyping }); // call the event 'typeing' and send the message on the client except the sender
  }
}
