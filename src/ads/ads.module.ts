import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';

@Module({
  controllers: [],
  providers: [AdsService],
})
export class AdsModule {}
