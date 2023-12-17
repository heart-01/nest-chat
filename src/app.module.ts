import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { NotifyModule } from './notify/notify.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdsModule } from './ads/ads.module';

@Module({
  imports: [EventEmitterModule.forRoot(), MessagesModule, NotifyModule, AdsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
