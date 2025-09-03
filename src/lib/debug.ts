export const debug = (...args: any[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

