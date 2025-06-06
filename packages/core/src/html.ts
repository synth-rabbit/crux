import { effect } from '@crux/reactivity';

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
function valueToNodes(v: any): Node[] {
  if (v === null || v === undefined || v === false) {
    return [];
  }
  if ((v as Node)?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return Array.from((v as DocumentFragment).cloneNode(true).childNodes);
  }
  if (v instanceof Node) {
    return [v];
  }
  if (Array.isArray(v)) {
    return v.flatMap(valueToNodes);
  }
  return [document.createTextNode(escapeHTML(String(v)))];
}

/* ───────────── main html tag ───────────── */
export function html<T extends unknown[]>(
  strings: TemplateStringsArray,
  ...vals: T
): DocumentFragment {
  let raw = '';
  for (let i = 0; i < strings.length; i++) {
    const str = strings[i];
    const isAttr = str.match(/=\s*["']?$/);
    const placeholder = i < vals.length ? (isAttr ? `__crux_expr_${i}__` : `<!--crux:${i}-->`) : '';
    raw += str + placeholder;
  }

  const tpl = document.createElement('template');
  tpl.innerHTML = raw;
  const frag = tpl.content;

  const walker = document.createTreeWalker(frag, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    comments.push(n as Comment);
  }

  for (const com of comments) {
    const m = com.nodeValue?.match(/^crux:(\d+)$/);
    if (!m) continue;

    const idx = +m[1];
    const expr = vals[idx];
    const parent = com.parentNode!;
    const placeholder = com;
    let nodes: Node[] = [];

    const render = (val: any) => {
      for (const n of nodes as ChildNode[]) n.remove();
      nodes = valueToNodes(val);
      for (const n of nodes) parent.insertBefore(n, placeholder);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => render(expr())) : render(expr);
  }

  const eWalker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  for (let n = eWalker.nextNode(); n; n = eWalker.nextNode()) {
    elements.push(n as Element);
  }

  for (const el of elements) {
    for (const attr of Array.from(el.attributes)) {
      const m = attr.value.match(/^__crux_expr_(\d+)__$/);
      if (!m) continue;

      const idx = +m[1];
      const expr = vals[idx];
      el.removeAttribute(attr.name);
      for (const directive of allDirectives) {
        if (directive.match(attr)) {
          directive.apply(el, attr, expr);
          break;
        }
      }
    }
  }

  return frag;
}
