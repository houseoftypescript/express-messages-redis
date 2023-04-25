import { Body, Post, Route, Tags } from 'tsoa';
import configs from '../../environments';
import { redis } from '../../libs/redis';

@Tags('Messages')
@Route('messages')
export class MessagesController {
  @Post('produce')
  public async produce(
    @Body() { message }: { message: string }
  ): Promise<void> {
    redis.publish(configs.redis.channel, message);
    return;
  }
}
