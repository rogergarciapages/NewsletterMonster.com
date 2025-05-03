/**
 * Logger utility to standardize logging across the application
 * Conditionally logs based on environment to avoid console statements in production
 */

const isDevelopment = process.env.NODE_ENV === "development";

// Create a logger object with methods for different log levels
const logger = {
  // Only log in development
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  // Only log in development
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  // Log warnings in all environments
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  // Log errors in all environments
  error: (...args: any[]) => {
    console.error(...args);
  },

  // Only log in development
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // Always log in all environments - use for critical information
  production: (...args: any[]) => {
    console.log(...args);
  },
};

export { logger };
