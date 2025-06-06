import { provideRouter, createRouter, Route, RouterConfig } from '@crux/router';
import { withContextScope } from '@crux/context';

interface CreateCruxAppOptions {
  /** Custom element tag name, e.g., 'my-app' */
  root: string;
  /** CSS selector to mount on */
  selector: string;
  /** Optional router setup */
  router?: {
    config?: RouterConfig;
    root: Route;
  };
}

export function createCruxApp({ root, selector, router }: CreateCruxAppOptions) {
  const mountPoint = document.querySelector(selector);
  if (!mountPoint) {
    console.error(`[crux] Mount point '${selector}' not found.`);
    return;
  }

  const el = document.createElement(root);
  if (router) {
    const r = createRouter(router.root, router.config);
    withContextScope(() => {
      provideRouter(r);
      mountPoint.appendChild(el);
    });
  } else {
    mountPoint.appendChild(el);
  }
}
