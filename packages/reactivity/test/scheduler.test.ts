import { describe, expect, it, vi } from 'vitest';

import { flush, queueJob } from '../src/scheduler';

import { flushSync } from './helpers/flushSync';

function nextTick(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

describe('scheduler', () => {
  it('runs queued jobs in order', async () => {
    const calls: string[] = [];

    queueJob(() => calls.push('first'));
    queueJob(() => calls.push('second'));

    await nextTick();
    expect(calls).toEqual(['first', 'second']);
  });

  it('avoids running the same job more than once per flush', async () => {
    const spy = vi.fn();

    queueJob(spy);
    queueJob(spy);
    queueJob(spy);

    await nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('defers jobs added during a flush to the next tick', async () => {
    const calls: string[] = [];

    const job2 = () => calls.push('job2');
    const job1 = () => {
      calls.push('job1');
      queueJob(job2); // added during flush
    };

    queueJob(job1);

    await nextTick();
    expect(calls).toEqual(['job1', 'job2']);
  });

  it('does not re-execute jobs scheduled during flush cycle', async () => {
    const spy = vi.fn(() => {
      queueJob(spy); // attempt to re-add itself
    });

    queueJob(spy);
    await nextTick();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not add a job if it is already in the queue', async () => {
    const spy = vi.fn();
    queueJob(spy);
    queueJob(spy); // Should not be added again
    await flushSync();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('scheduler > flush()', () => {
  it('skips re-entry if already flushing', () => {
    const spy = vi.fn();

    // simulate flushing state
    // We need to indirectly set this unless flush is more controllable
    // One way: call flush, then queue a job that tries to re-enter flush
    queueJob(() => {
      flush(); // should be a no-op because we’re already in a flush
      spy();
    });

    flush(); // begin initial flush

    expect(spy).toHaveBeenCalledTimes(1); // not duplicated
  });
});
