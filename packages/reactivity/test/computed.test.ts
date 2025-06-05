import { computed, createSignal } from '../src';

import { flushSync } from './helpers/flushSync';

it('only re-evaluates when computed output changes', async () => {
  const spy = vi.fn();
  const [count, setCount] = createSignal(1);

  const doubled = computed(() => {
    spy();
    return count() * 2;
  });

  expect(doubled()).toBe(2);
  expect(spy).toHaveBeenCalledTimes(1);

  setCount(2); // changes computed value
  await flushSync();
  expect(doubled()).toBe(4);
  expect(spy).toHaveBeenCalledTimes(2);

  setCount(2); // same input, no change in value
  await flushSync();
  expect(doubled()).toBe(4);
  expect(spy).toHaveBeenCalledTimes(2); // still 2, not re-evaluated
});
