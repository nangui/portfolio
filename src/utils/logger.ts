/**
 * Logger utility for conditional logging in development
 * Logs are disabled in production builds
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
};
