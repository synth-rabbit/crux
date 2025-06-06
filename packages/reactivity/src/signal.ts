import { queueJob } from './scheduler';
import { currentEffect } from './effect';
import type { ReactiveEffect, Signal } from './types';
import { forEach } from 'ramda';

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

    forEach(queueJob, Array.from(subscribers));
  }

  return [read, write];
}
