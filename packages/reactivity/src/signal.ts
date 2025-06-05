import { queueJob } from './scheduler';
import { currentEffect } from './effect';
import type { ReactiveEffect, Signal } from './types';

export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<ReactiveEffect>();

  function read(): T {
    if (currentEffect !== null) {
      subscribers.add(currentEffect);
    }
    return value;
  }

  function write(newValue: T): void {
    if (Object.is(newValue, value)) return;

    value = newValue;

    for (const sub of subscribers) {
      queueJob(sub);
    }
  }

  return [read, write];
}
