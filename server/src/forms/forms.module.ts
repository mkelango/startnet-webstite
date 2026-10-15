import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FrappeService } from './frappe.service';

@Module({
  controllers: [FormsController],
  providers: [FormsService, FrappeService],
})
export class FormsModule {}
