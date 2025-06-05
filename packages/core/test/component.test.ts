import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from '@crux/core';

describe('defineComponent', () => {
  const tagName = 'x-test-element';

  beforeEach(() => {
    // Ensure no conflict with already defined custom elements in repeated runs
    if (customElements.get(tagName)) {
      // Skip if element is already defined, as there's no standard API to undefine
      return;
    }
  });

  it('defines a custom element that sets up its shadow DOM', () => {
    const frag = document.createDocumentFragment();
    const node = document.createElement('span');
    node.textContent = 'Hello';
    frag.appendChild(node);

    const setup = vi.fn(() => frag);
    defineComponent(tagName, setup);

    const el = document.createElement(tagName) as HTMLElement & { shadow: ShadowRoot };

    expect(setup).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot).toBeInstanceOf(ShadowRoot);
    expect(el.shadowRoot?.childNodes.length).toBe(1);
    expect(el.shadowRoot?.firstChild?.textContent).toBe('Hello');
  });
});
