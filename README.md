# Crux

Crux is a small experimental frontend framework.  It is organised as a `pnpm` workspace containing a few packages that provide reactive primitives, context support and DOM helpers.  A Vite based playground under `./playground` demonstrates how everything fits together.

## Packages

- **`@crux/reactivity`** – signal based reactivity with `createSignal`, `effect`, and `computed`.  A tiny scheduler ensures effects run asynchronously.
- **`@crux/context`** – context utilities (`createContext`, `provide`, `useContext`) built on top of signals.
- **`@crux/core`** – helpers for creating custom elements and rendering HTML templates.  Includes the `html` template tag and directives such as `cx-on` and `cx:if`.

## Getting started

Install dependencies with `pnpm install` and then run the playground:

```bash
pnpm dev
```

This starts a Vite dev server and mounts `playground/main.ts` which bootstraps the example components.

### Scripts

- `pnpm test` – run the unit test suite with Vitest.
- `pnpm build` – build the packages using Rollup.
- `pnpm lint` – run ESLint.
- `pnpm format` – format source files with Prettier.

## Example usage

Creating a simple component:

```ts
import { defineComponent, html } from '@crux/core';
import { createSignal } from '@crux/reactivity';

defineComponent('hello-world', () => {
  const [count, setCount] = createSignal(0);
  return html`
    <button cx-on:click=${() => setCount(count() + 1)}>
      Clicked ${count} times
    </button>
  `;
});
```

Mount the root component using `createCruxApp` in `main.ts`:

```ts
import { createCruxApp } from '@crux/core';

createCruxApp({
  root: 'hello-world',
  selector: '#app',
});
```

## License

This project is licensed under the MIT License.
