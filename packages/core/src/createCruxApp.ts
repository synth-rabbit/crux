interface CreateCruxAppOptions {
  /** Custom element tag name, e.g., 'my-app' */
  root: string;
  /** CSS selector to mount on */
  selector: string;
}

import { isNil } from 'ramda';

export function createCruxApp({ root, selector }: CreateCruxAppOptions) {
  const mountPoint = document.querySelector(selector);
  if (isNil(mountPoint)) {
    console.error(`[crux] Mount point '${selector}' not found.`);
    return;
  }

  const el = document.createElement(root);
  mountPoint.appendChild(el);
}
