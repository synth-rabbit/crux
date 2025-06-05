import { createSignal } from './signal';
import { effect } from './effect';
import { Accessor } from './types';

export function computed<T>(fn: () => T): Accessor<T> {
  const [get, set] = createSignal(undefined as unknown as T);

  effect(() => {
    set(fn());
  });

  return get;
}
