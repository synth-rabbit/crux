import { effect } from '@crux/reactivity';
import { map } from 'ramda';

export const cxText = <T>(sig: () => T) => {
  const node = document.createTextNode(String(sig()));
  effect(() => {
    node.textContent = String(sig());
  });
  return () => node;
};

export const cxList =
  <T>(getList: () => T[], mapFn: (item: T) => Node) =>
  () =>
    map(mapFn, getList());

export const cxClass =
  (condition: () => boolean, trueClass: string, falseClass = '') =>
  () =>
    condition() ? trueClass : falseClass;
