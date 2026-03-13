import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionController } from './exception/exception.controller';

@Module({
  imports: [],
  controllers: [AppController, ExceptionController],
  providers: [AppService],
})
export class AppModule {}
