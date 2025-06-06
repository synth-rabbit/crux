import { createSignal } from '@crux/reactivity';
import { createContext, provide, useContext } from '@crux/context';
import type { Signal } from '@crux/reactivity';

export interface Route {
  path: string;
  component: string;
  children?: Route[];
}

export interface RouterConfig {
  base?: string;
}

export interface RouteMatch {
  /** full pathname without the query string */
  path: string;
  /** matched route record */
  route: Route;
  /** dynamic parameters extracted from the path */
  params: Record<string, string>;
  /** parsed query string values */
  query: Record<string, string>;
}

export interface Router {
  /** current full path including query */
  currentPath: Signal<string>;
  /** computed details for the current route */
  currentRoute: Signal<RouteMatch>;
  push(path: string): void;
  replace(path: string): void;
  root: Route;
}

export const RouterContext = createContext<Router>();

function normalize(base: string, p: string): string {
  if (base && p.startsWith(base)) p = p.slice(base.length);
  return p.startsWith('/') ? p : '/' + p;
}

function parseQuery(q: string): Record<string, string> {
  const query: Record<string, string> = {};
  q.replace(/^\?/, '')
    .split('&')
    .filter(Boolean)
    .forEach((part) => {
      const [k, v] = part.split('=');
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
    });
  return query;
}

function matchRoute(root: Route, fullPath: string): RouteMatch {
  const [pathPart, search = ''] = fullPath.split('?');
  const segments = pathPart.replace(/^\//, '').split('/').filter(Boolean);
  const params: Record<string, string> = {};
  let current = root;

  let children = root.children ?? [];
  for (const seg of segments) {
    let matched: Route | undefined;
    for (const r of children) {
      if (r.path === seg) {
        matched = r;
        break;
      }
      if (r.path.startsWith(':')) {
        params[r.path.slice(1)] = seg;
        matched = r;
        break;
      }
    }
    if (!matched) break;
    current = matched;
    children = matched.children ?? [];
  }

  return { path: '/' + segments.join('/'), route: current, params, query: parseQuery(search) };
}

export function createRouter(root: Route, config: RouterConfig = {}): Router {
  const base = config.base ?? '';
  const currentUrl = normalize(base, window.location.pathname + window.location.search);
  const [path, setPath] = createSignal(currentUrl);
  const [current, setCurrent] = createSignal(matchRoute(root, currentUrl));

  const update = (to: string, method: 'push' | 'replace') => {
    const full = base + to;
    history[method + 'State'](null, '', full);
    const normalized = normalize(base, to);
    setPath(normalized);
    setCurrent(matchRoute(root, normalized));
  };

  const push = (to: string) => update(to, 'push');
  const replace = (to: string) => update(to, 'replace');

  window.addEventListener('popstate', () => {
    const loc = normalize(base, window.location.pathname + window.location.search);
    setPath(loc);
    setCurrent(matchRoute(root, loc));
  });

  return { currentPath: [path, setPath], currentRoute: [current, setCurrent], push, replace, root };
}

export function provideRouter(router: Router) {
  provide(RouterContext, router);
}

export function useRouter(): Router {
  const sig = useContext(RouterContext);
  if (!sig) {
    throw new Error('[crux/router] Router context not found');
  }
  return sig[0]();
}

export function useRoute(): RouteMatch {
  return useRouter().currentRoute[0]();
}
