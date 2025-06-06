// scheduler.ts
import type { ReactiveEffect } from './types';

const queue: ReactiveEffect[] = [];
const pending = new Set<ReactiveEffect>();
let flushing = false;

/**
 * Queues a reactive effect for execution.
 * Ensures effects added during a flush cycle are deferred to the next microtask.
 */
export function queueJob(job: ReactiveEffect): void {
  if (!pending.has(job)) {
    pending.add(job);
    queue.push(job);
    if (!flushing) {
      queueMicrotask(flush);
    }
  }
}

export function flush(): void {
  if (flushing) return;
  flushing = true;

  while (queue.length > 0) {
    const job = queue.shift()!;
    job();
    pending.delete(job);
  }

  flushing = false;
}
