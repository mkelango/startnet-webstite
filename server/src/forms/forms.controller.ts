import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FormsService } from './forms.service';

/**
 * POST /api/forms/:type — contact · enquiry · newsletter · join · interest · nomination · host · speak
 * 201 { ok: true, id, message } · 400 { message, fieldErrors } · 404 unknown type · 429 rate-limited
 */
@Controller('forms')
@UseGuards(ThrottlerGuard)
export class FormsController {
  constructor(private readonly forms: FormsService) {}

  @Post(':type')
  @HttpCode(201)
  submit(@Param('type') type: string, @Body() body: unknown) {
    return this.forms.submit(type, body);
  }
}
