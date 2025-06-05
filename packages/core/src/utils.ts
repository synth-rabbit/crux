export const isFunction = <T>(v: unknown): v is () => T => typeof v === 'function';
export const unwrap = <T = unknown>(v: unknown): T => (isFunction<T>(v) ? v() : (v as T));
