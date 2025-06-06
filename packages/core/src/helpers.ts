import { effect } from '@crux/reactivity';

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
    getList().map(mapFn);

export const cxClass =
  (condition: () => boolean, trueClass: string, falseClass = '') =>
  () =>
    condition() ? trueClass : falseClass;
