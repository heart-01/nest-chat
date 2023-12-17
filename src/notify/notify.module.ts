import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';

@Module({
  controllers: [],
  providers: [NotifyService],
})
export class NotifyModule {}
