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
  if (v == null || v === false) return [];

  if (v instanceof DocumentFragment) {
    const frag = v.cloneNode(true) as DocumentFragment;
    return Array.from(frag.childNodes);
  }

  if (v instanceof Node) return [v];

  if (Array.isArray(v)) return v.flatMap(valueToNodes);
  return [document.createTextNode(escapeHTML(String(v)))];
}

/* ───────────── main html tag ───────────── */
export function html<T extends unknown[]>(
  strings: TemplateStringsArray,
  ...vals: T
): DocumentFragment {
  let raw = '';
  for (let i = 0; i < strings.length; i++) {
    raw += strings[i];
    if (i < vals.length) {
      const isAttr = strings[i].match(/=\s*["']?$/);
      raw += isAttr ? `__crux_expr_${i}__` : `<!--crux:${i}-->`;
    }
  }

  const tpl = document.createElement('template');
  tpl.innerHTML = raw;
  const frag = tpl.content;

  const walker = document.createTreeWalker(frag, NodeFilter.SHOW_COMMENT);
  let com: Comment | null;
  while ((com = walker.nextNode() as Comment | null)) {
    const m = com.nodeValue?.match(/^crux:(\d+)$/);
    if (!m) continue;

    const idx = +m[1];
    const expr = vals[idx];
    const parent = com.parentNode!;
    const placeholder = com;
    let nodes: Node[] = [];

    const render = (val: any) => {
      (nodes as ChildNode[]).forEach((n) => n.remove());
      nodes = valueToNodes(val);
      nodes.forEach((n) => parent.insertBefore(n, placeholder));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => render(expr())) : render(expr);
  }

  const eWalker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT);
  let el: Element | null;
  while ((el = eWalker.nextNode() as Element | null)) {
    for (const attr of Array.from(el.attributes)) {
      const m = attr.value.match(/^__crux_expr_(\d+)__$/);
      if (!m) continue;

      const idx = +m[1];
      const expr = vals[idx];
      el.removeAttribute(attr.name);
      console.log('allDirectives', allDirectives);

      for (const directive of allDirectives) {
        console.log('directive', directive);
        console.log('attr', attr);
        console.log('directive.match(attr)', directive.match(attr));
        if (directive.match(attr)) {
          directive.apply(el, attr, expr);
          break;
        }
      }
    }
  }

  return frag;
}
