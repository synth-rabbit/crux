export function flushSync(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}
