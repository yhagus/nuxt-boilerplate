import type { CaptureContext, SeverityLevel } from '@sentry/core';
import * as Sentry from '@sentry/nuxt';

interface SentryPayload {
  userInfo: {
    id: string;
    email: string;
  };
  endpoint?: string;
  message: any;
}

export function useSentry() {
  const config = useRuntimeConfig();

  const isSentryEnabled = computed(() => {
    return config.public.sentry.enabled === true || config.public.sentry.enabled === 'true';
  });

  const captureMessage = (message: string, context?: CaptureContext | SeverityLevel) => {
    if (isSentryEnabled.value) {
      Sentry.captureMessage(message, context);
    }
  };

  const createPayload = (message: any, endpoint?: string): string => {
    const userInfo = useState<User>('USER_SESSION');

    const payload: SentryPayload = {
      userInfo: {
        id: userInfo.value?.id || '',
        email: userInfo.value?.email || '',
      },
      endpoint,
      message,
    };

    return JSON.stringify(payload);
  };

  const sendInfo = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'info');
  };

  const sendWarning = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'warning');
  };

  const sendError = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'error');
  };

  const sendFatal = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'fatal');
  };

  const sendLog = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'log');
  };

  const sendDebug = (message: any, endpoint?: string) => {
    captureMessage(createPayload(message, endpoint), 'debug');
  };

  // Enhanced methods with better error handling
  const captureException = (error: Error, context?: CaptureContext) => {
    if (isSentryEnabled.value) {
      Sentry.captureException(error, context);
    }
  };

  const setUser = (user: Partial<User>) => {
    if (isSentryEnabled.value) {
      Sentry.setUser(user);
    }
  };

  const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
    if (isSentryEnabled.value) {
      Sentry.addBreadcrumb(breadcrumb);
    }
  };

  return {
    // Core methods
    captureMessage,
    captureException,

    // Logging methods with different severity levels
    sendInfo,
    sendWarning,
    sendError,
    sendFatal,
    sendLog,
    sendDebug,

    // User and context methods
    setUser,
    addBreadcrumb,

    // Utility
    isSentryEnabled: readonly(isSentryEnabled),
  };
}
