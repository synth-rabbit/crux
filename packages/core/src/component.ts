import { withContextScope } from '@crux/context';

export function defineComponent(tag: string, setup: () => DocumentFragment) {
  customElements.define(
    tag,
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        const fragment = withContextScope(setup);
        this.shadow.appendChild(fragment);
      }
    }
  );
}
