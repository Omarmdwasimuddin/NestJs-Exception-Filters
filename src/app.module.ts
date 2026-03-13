import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionController } from './exception/exception.controller';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [],
  controllers: [AppController, ExceptionController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}
