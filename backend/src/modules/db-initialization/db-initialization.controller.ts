import { Controller } from '@nestjs/common';
import { DbInitializationService } from './db-initialization.service';

@Controller('db-initialization')
export class DbInitializationController {
  constructor(private readonly dbInitializationService: DbInitializationService) {}
}
