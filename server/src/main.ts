import 'reflect-metadata';
import './common/env';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/http-exception.filter';
import { CLIENT_DIST } from './common/paths';
import { checkRouteSync } from './common/route-sync';
import { loadStaticTables, RouteTable } from './common/routes';
import { PrerenderStore } from './common/prerender';
import { apiCacheHeaders, preStatic, spaFallback, staticHeaders } from './common/spa';
import { ContentService } from './content/content.service';

const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

/** CORS_ORIGINS="https://startnet.in,https://www.startnet.in" (comma list); defaults to the Vite dev origins. */
function corsOrigins(): string[] {
  const list = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : DEV_ORIGINS;
}

/**
 * TRUST_PROXY: Express "trust proxy" setting. Default 'loopback' trusts X-Forwarded-For only from a proxy
 * on the same machine, so a client cannot spoof its IP (and dodge the form rate limit) with the header.
 * Accepts a hop count ("1"), true/false, or a comma list of addresses/subnets ("loopback, 10.0.0.0/8").
 */
function trustProxy(): boolean | number | string {
  const raw = (process.env.TRUST_PROXY ?? 'loopback').trim();
  if (/^\d+$/.test(raw)) return Number(raw);
  if (raw === 'true') return true;
  if (raw === 'false' || raw === '') return false;
  return raw;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const production = process.env.NODE_ENV === 'production';

  // Every controller lives under /api; the built client is served below.
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApiExceptionFilter());

  // CSP only in production: the Vite dev server needs inline/eval scripts for HMR.
  app.use(
    helmet({
      contentSecurityPolicy: production
        ? {
            useDefaults: false,
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"], // framer-motion and React style attributes
              imgSrc: ["'self'", 'data:', 'https://i.ytimg.com'], // event video posters (VideoFeature)
              fontSrc: ["'self'", 'data:'],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              frameAncestors: ["'self'"],
              frameSrc: ['https://www.youtube-nocookie.com', 'https://www.google.com'], // + office map on /contact // event videos, loaded only when played
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.use(compression());
  app.use(apiCacheHeaders());
  app.enableCors({ origin: corsOrigins(), methods: ['GET', 'POST', 'OPTIONS'] });
  app.set('trust proxy', trustProxy());
  app.disable('x-powered-by');
  app.enableShutdownHooks();

  // Route table for the SPA fallback and sitemap.xml: static routes, static-slugs.json and the data slugs
  // (programmes, events, series/editions, Ledger periods, reports, press releases, careers, stories).
  const content = app.get(ContentService);
  const statics = loadStaticTables();
  const table = new RouteTable(statics, content);
  checkRouteSync(statics.slugs, undefined, statics.districtAliases);

  if (CLIENT_DIST) {
    const prerender = new PrerenderStore(CLIENT_DIST);
    app.use(preStatic(CLIENT_DIST, () => table, () => content, prerender));
    app.useStaticAssets(CLIENT_DIST, { index: false, redirect: false, maxAge: '1h', setHeaders: staticHeaders(CLIENT_DIST) });
    app.use(spaFallback(CLIENT_DIST, () => table, prerender));
  }

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  const logger = new Logger('StartNet');
  logger.log(`API ready at http://localhost:${port}/api (health: /api/health)`);
  logger.log(
    CLIENT_DIST
      ? `Serving the built site from ${CLIENT_DIST} at http://localhost:${port}/`
      : 'client/dist not found: API only. Run the Vite dev server on http://localhost:5173.',
  );
}

bootstrap();
