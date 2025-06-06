// scheduler.ts
import type { ReactiveEffect } from './types';
import { includes, forEach } from 'ramda';

const queue: ReactiveEffect[] = [];
let flushing = false;

/**
 * Queues a reactive effect for execution.
 * Ensures effects added during a flush cycle are deferred to the next microtask.
 */
export function queueJob(job: ReactiveEffect): void {
  if (!includes(job, queue)) {
    queue.push(job);
    if (!flushing) {
      queueMicrotask(flush);
    }
  }
}

export function flush(): void {
  if (flushing) return;
  flushing = true;

  const seen = new Set<ReactiveEffect>();

  while (queue.length > 0) {
    const pending = queue.slice();
    queue.length = 0;

    forEach((job: ReactiveEffect) => {
      if (!seen.has(job)) {
        seen.add(job);
        job();
      }
    }, pending);
  }

  flushing = false;
}
