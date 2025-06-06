import { effect } from '@crux/reactivity';
import {
  addIndex,
  reduce,
  forEach,
  cond,
  T,
  is,
  isNil,
  either,
  always,
} from 'ramda';

import { allDirectives } from './directives';
import { isFunction } from './utils';

/* ───────── util: HTML escape ───────── */
function escapeHTML(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─── convert any interpolation value → Node[] ─── */
const valueToNodes = (v: any): Node[] =>
  cond<any, Node[]>([
    [either(isNil, (x) => x === false), always([])],
    [is(DocumentFragment), (frag: DocumentFragment) => Array.from(frag.cloneNode(true).childNodes)],
    [is(Node), (node: Node) => [node]],
    [Array.isArray, (arr: unknown[]) => (arr as unknown[]).flatMap(valueToNodes)],
    [T, (val: unknown) => [document.createTextNode(escapeHTML(String(val)))]],
  ])(v);

/* ───────────── main html tag ───────────── */
export function html<T extends unknown[]>(
  strings: TemplateStringsArray,
  ...vals: T
): DocumentFragment {
  const reduceIndexed = addIndex<string, string>(reduce);
  const raw = reduceIndexed(
    (acc, str, i) => {
      const isAttr = str.match(/=\s*["']?$/);
      const placeholder =
        i < vals.length ? (isAttr ? `__crux_expr_${i}__` : `<!--crux:${i}-->`) : '';
      return acc + str + placeholder;
    },
    '',
    strings
  );

  const tpl = document.createElement('template');
  tpl.innerHTML = raw;
  const frag = tpl.content;

  const walker = document.createTreeWalker(frag, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    comments.push(n as Comment);
  }

  forEach((com: Comment) => {
    const m = com.nodeValue?.match(/^crux:(\d+)$/);
    if (!m) return;

    const idx = +m[1];
    const expr = vals[idx];
    const parent = com.parentNode!;
    const placeholder = com;
    let nodes: Node[] = [];

    const render = (val: any) => {
      forEach((n: ChildNode) => n.remove(), nodes as ChildNode[]);
      nodes = valueToNodes(val);
      forEach((n: Node) => parent.insertBefore(n, placeholder), nodes);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => render(expr())) : render(expr);
  }, comments);

  const eWalker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  for (let n = eWalker.nextNode(); n; n = eWalker.nextNode()) {
    elements.push(n as Element);
  }

  forEach((el: Element) => {
    forEach((attr: Attr) => {
      const m = attr.value.match(/^__crux_expr_(\d+)__$/);
      if (!m) return;

      const idx = +m[1];
      const expr = vals[idx];
      el.removeAttribute(attr.name);
      for (const directive of allDirectives) {
        if (directive.match(attr)) {
          directive.apply(el, attr, expr);
          break;
        }
      }
    }, Array.from(el.attributes));
  }, elements);

  return frag;
}
