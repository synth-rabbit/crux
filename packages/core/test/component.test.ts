import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from '@crux/core';

async function flush() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(() => queueMicrotask(resolve)));
  });
}

describe('defineComponent', () => {
  const tagName = 'x-test-element';
  const propsTag = 'x-test-props';
  const reactiveTag = 'x-test-reactive';

  beforeEach(() => {
    // Skip setup if elements already defined, as they cannot be redefined
    if (
      customElements.get(tagName) ||
      customElements.get(propsTag) ||
      customElements.get(reactiveTag)
    ) {
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
    document.body.appendChild(el);

    expect(setup).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot).toBeInstanceOf(ShadowRoot);
    expect(el.shadowRoot?.childNodes.length).toBe(1);
    expect(el.shadowRoot?.firstChild?.textContent).toBe('Hello');
  });

  it('passes attributes as props to setup', () => {
    const setup = vi.fn(() => document.createDocumentFragment());
    defineComponent(propsTag, setup);

    document.body.innerHTML = `<${propsTag} foo="bar" answer="42"></${propsTag}>`;

    expect(setup).toHaveBeenCalledWith(expect.objectContaining({ foo: 'bar', answer: '42' }));
  });

  it('updates props when attributes change', async () => {
    let received: Record<string, string | undefined> = {};
    defineComponent(reactiveTag, (props) => {
      received = props;
      return document.createDocumentFragment();
    });

    document.body.innerHTML = `<${reactiveTag} foo="one"></${reactiveTag}>`;

    const el = document.querySelector(reactiveTag) as HTMLElement;
    expect(received.foo).toBe('one');

    el.setAttribute('foo', 'two');
    await flush();

    expect(received.foo).toBe('two');
  });
});
