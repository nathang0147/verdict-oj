import { Module } from '@nestjs/common';
import { DbInitializationService } from './db-initialization.service';
import { DbInitializationController } from './db-initialization.controller';

@Module({
  controllers: [DbInitializationController],
  providers: [DbInitializationService],
})
export class DbInitializationModule {}
