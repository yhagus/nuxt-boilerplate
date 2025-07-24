import { useRuntimeConfig } from '#imports';
import * as Sentry from '@sentry/nuxt';

Sentry.init({
  // If set up, you can use your runtime config here
  dsn: useRuntimeConfig().public.sentryDsnKey,
});
