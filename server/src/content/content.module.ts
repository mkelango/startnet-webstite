import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { SearchService } from './search.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, SearchService],
  exports: [ContentService],
})
export class ContentModule {}
