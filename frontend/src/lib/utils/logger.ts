export const log = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') console.debug(`[DEBUG] ${message}`, ...args);
  }
};
