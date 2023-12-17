export class NotifyChatRoomCreatedEvent {
  name: string;
  clientId: string;

  constructor(name: string, clientId: string) {
    this.name = name;
    this.clientId = clientId;
  }
}
