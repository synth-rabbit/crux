import { defineComponent, html } from '@crux/core';
import { createSignal } from '@crux/reactivity';

// Example component demonstrating props usage
export interface HelloWorldProps {
  label?: string;
}

defineComponent('hello-world', (props: HelloWorldProps) => {
  const [count, setCount] = createSignal(0);
  return html`
    <button cx-on:click=${() => setCount(count() + 1)}>
      ${props.label ?? 'Clicked'} ${count} times
    </button>
  `;
});
