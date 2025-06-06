# Crux

Crux is a small experimental frontend framework. It is organised as a `pnpm` workspace containing a few packages that provide reactive primitives, context support and DOM helpers. A Vite based playground under `./playground` demonstrates how everything fits together.

## Packages

- **`@crux/reactivity`** – signal based reactivity with `createSignal`, `effect`, and `computed`. A tiny scheduler ensures effects run asynchronously.
- **`@crux/context`** – context utilities (`createContext`, `provide`, `useContext`) built on top of signals.
- **`@crux/core`** – helpers for creating custom elements and rendering HTML templates. Includes the `html` template tag and directives such as `cx-on`, `cx:if`, `cx:show`, `cx:model`, `cx:style`, and `cx:for`.
- **`@crux/router`** – client side router supporting nested routes, dynamic segments, query strings and a handy `<cx-link>` component.
- **`@crux/forms`** – utilities for managing form state and validations.

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

defineComponent('hello-world', (props) => {
  const [count, setCount] = createSignal(0);
  return html`
    <button cx-on:click=${() => setCount(count() + 1)}>
      ${props.label ?? 'Clicked'} ${count} times
    </button>
  `;
});
```

Props can be passed as attributes when using the component:

```html
<hello-world label="Press"></hello-world>
```

You can see this in action by running the playground (`pnpm dev`).

Mount the root component using `createCruxApp` in `main.ts`:

```ts
import './hello-world.ts';
import { createCruxApp } from '@crux/core';
createCruxApp({
  root: 'hello-world',
  selector: '#app',
  router: {
    root: {
      path: '/',
      component: 'hello-world',
      children: [{ path: 'todos/:id', component: 'todo-detail' }],
    },
  },
});
```

Inside components you can access route details via `useRoute`:

```ts
import { defineComponent, html } from '@crux/core';
import { useRoute } from '@crux/router';

defineComponent('todo-detail', () => {
  const { params, query } = useRoute();
  return html`<p>Todo ${params.id} sorted by ${query.sort}</p>`;
});
```

## License

This project is licensed under the MIT License.
