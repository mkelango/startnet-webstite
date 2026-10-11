import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { MESSAGES } from '../forms/form-rules';

type ErrorBody = {
  statusCode: number;
  message: string;
  fieldErrors: Record<string, string>;
  /** Stable code per field error (required, email, tel, consent, format, max), for client-side copy. */
  fieldCodes?: Record<string, string>;
};

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * Every error leaves the API as { statusCode, message, fieldErrors } (docs/CONTRACT.md),
 * with friendly copy instead of raw parser or framework text.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApiExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();
    if (res.headersSent) return;

    // Form endpoints say "form"; any other 400 (e.g. a malformed %-escape in a path) is about the address.
    const path = String(req?.path ?? req?.url ?? '');
    const unreadable = path.startsWith('/api/forms') ? MESSAGES.unreadable : MESSAGES.badAddress;
    const body = this.toBody(exception, unreadable);
    // Errors are never cached (GET /api responses carry a short public cache from apiCacheHeaders).
    res.setHeader('Cache-Control', 'no-store');

    if (body.statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      // @nestjs/throttler names its header per throttler (Retry-After-forms); also send the standard one.
      const named = res.getHeaderNames().find((h) => h.startsWith('retry-after-'));
      const seconds = named ? Number(res.getHeader(named)) : NaN;
      res.setHeader('Retry-After', String(Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 600));
    }

    res.status(body.statusCode).json({ ...body, fieldCodes: body.fieldCodes ?? {} });
  }

  private toBody(exception: unknown, unreadable: string): ErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      if (statusCode === HttpStatus.TOO_MANY_REQUESTS) return { statusCode, message: MESSAGES.tooMany, fieldErrors: {} };
      if (statusCode === HttpStatus.PAYLOAD_TOO_LARGE) return { statusCode, message: MESSAGES.tooLarge, fieldErrors: {} };
      const r = exception.getResponse();
      // Nest re-throws body-parser failures as a plain BadRequestException carrying the raw parser text
      // ("Expected property name or '}' in JSON at position 1"). Our own 400s always carry fieldErrors.
      if (statusCode === HttpStatus.BAD_REQUEST && !(isRecord(r) && isRecord(r.fieldErrors))) {
        return { statusCode, message: unreadable, fieldErrors: {} };
      }
      const fieldErrors = isRecord(r) && isRecord(r.fieldErrors) ? (r.fieldErrors as Record<string, string>) : {};
      const fieldCodes = isRecord(r) && isRecord(r.fieldCodes) ? (r.fieldCodes as Record<string, string>) : undefined;
      let message = isRecord(r) ? r.message : r;
      if (Array.isArray(message)) message = message.filter((m) => typeof m === 'string').join(' ');
      if (statusCode >= 500) {
        this.logger.error(exception.message, exception.stack);
        return { statusCode, message: MESSAGES.serverError, fieldErrors: {} };
      }
      if (typeof message !== 'string' || !message || /^Cannot (GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) /.test(message)) {
        message = statusCode === HttpStatus.NOT_FOUND ? MESSAGES.notFound : unreadable;
      }
      return { statusCode, message: message as string, fieldErrors, ...(fieldCodes ? { fieldCodes } : {}) };
    }

    // Errors raised by body-parser before a controller runs (bad JSON, body too large, bad charset…).
    const e = exception as { status?: unknown; statusCode?: unknown; type?: unknown; message?: string; stack?: string };
    const status = Number(e?.status ?? e?.statusCode);
    if (status === HttpStatus.PAYLOAD_TOO_LARGE || e?.type === 'entity.too.large') {
      return { statusCode: HttpStatus.PAYLOAD_TOO_LARGE, message: MESSAGES.tooLarge, fieldErrors: {} };
    }
    if (exception instanceof SyntaxError || e?.type === 'entity.parse.failed' || (status >= 400 && status < 500)) {
      return { statusCode: status >= 400 && status < 500 ? status : HttpStatus.BAD_REQUEST, message: unreadable, fieldErrors: {} };
    }

    this.logger.error(e?.message ?? String(exception), e?.stack);
    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGES.serverError, fieldErrors: {} };
  }
}
