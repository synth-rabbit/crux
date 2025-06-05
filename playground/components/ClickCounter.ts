import { defineComponent, html } from '@crux/core';
import { createSignal } from '@crux/reactivity';

defineComponent('click-counter', () => {
  const [count, setCount] = createSignal(0);

  return html`
    <div>
      <h1>${count}</h1>
      <button cx-on:click="${() => setCount(count() + 1)}">+1</button>
    </div>
  `;
});
