import { withContextScope } from '@crux/context';

export function defineComponent<P extends Record<string, any> = Record<string, string>>(
  tag: string,
  setup: (props: P) => DocumentFragment
) {
  customElements.define(
    tag,
    class extends HTMLElement {
      shadow!: ShadowRoot;
      private _props!: Record<string, string | undefined>;
      private _origSet?: (name: string, value: string) => void;
      private _origRemove?: (name: string) => void;

      connectedCallback() {
        if (this.shadowRoot) return;
        this.shadow = this.attachShadow({ mode: 'open' });

        const props: Record<string, string | undefined> = {};
        for (const name of this.getAttributeNames()) {
          props[name] = this.getAttribute(name) ?? undefined;
        }
        this._props = props;

        this._origSet = this.setAttribute.bind(this);
        this._origRemove = this.removeAttribute.bind(this);
        this.setAttribute = (name: string, value: string) => {
          this._origSet!(name, value);
          this._props[name] = value;
        };
        this.removeAttribute = (name: string) => {
          this._origRemove!(name);
          delete this._props[name];
        };

        const fragment = withContextScope(() => setup(props as P));
        this.shadow.appendChild(fragment);
      }

      disconnectedCallback() {
        if (this._origSet) this.setAttribute = this._origSet;
        if (this._origRemove) this.removeAttribute = this._origRemove;
      }
    }
  );
}
