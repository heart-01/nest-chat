import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AdsService {
  @OnEvent('ads.enabled')
  enabledAds(status: boolean) {
    console.log(`1. Ads enabled: ${status}`);
    return 1;
  }

  @OnEvent('ads.enabled')
  doSomthing() {
    console.log(`2. Ads do something`);
    return 2;
  }
}
