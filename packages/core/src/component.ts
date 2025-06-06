import { withContextScope } from '@crux/context';

export function defineComponent<P extends Record<string, any> = Record<string, string>>(
  tag: string,
  setup: (props: P) => DocumentFragment
) {
  customElements.define(
    tag,
    class extends HTMLElement {
      shadow!: ShadowRoot;

      connectedCallback() {
        if (this.shadowRoot) return;
        this.shadow = this.attachShadow({ mode: 'open' });

        const props = {} as Record<string, string>;
        for (const name of this.getAttributeNames()) {
          props[name] = this.getAttribute(name)!;
        }

        const fragment = withContextScope(() => setup(props as P));
        this.shadow.appendChild(fragment);
      }
    }
  );
}
