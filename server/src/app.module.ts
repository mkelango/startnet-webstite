import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContentModule } from './content/content.module';
import { FormsModule } from './forms/forms.module';
import { MESSAGES } from './forms/form-rules';

// The built React app (client/dist) is served from main.ts: static files with long-lived caching for
// hashed /assets, and an SPA fallback that returns 404 for unknown routes and missing files.
@Module({
  imports: [
    // Applied to the forms controller only (see FormsController @UseGuards).
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'forms', ttl: 10 * 60 * 1000, limit: 20 }],
      errorMessage: MESSAGES.tooMany,
    }),
    ContentModule,
    FormsModule,
  ],
})
export class AppModule {}
