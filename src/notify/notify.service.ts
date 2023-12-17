import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotifyChatRoomCreatedEvent } from './dto/notify-chat-room-created.event';

@Injectable()
export class NotifyService {
  @OnEvent('user.joined')
  notifyChatRoom({ clientId }: NotifyChatRoomCreatedEvent) {
    console.log(`1. Notify User ${clientId} joined the chat room`);
  }

  @OnEvent('user.joined')
  doSomthing() {
    console.log(`2. Notify do something`);
  }
}
