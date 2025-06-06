import {
  cxClass,
  cxList,
  cxText,
  defineComponent,
  html,
} from '@crux/core';
import { provide, useContext } from '@crux/context';
import { computed, createSignal } from '@crux/reactivity';
import { ThemeContext } from '../context/ThemeContext';
import './ContextChild';

// Root component showcasing the main Crux features
defineComponent('my-app', () => {
  // Set up a context value for the current scope
  provide(ThemeContext, 'light');
  const [theme, setTheme] = useContext(ThemeContext)!;

  // Basic signal example
  const [count, setCount] = createSignal(0);
  // Computed signal derived from `count`
  const doubleCount = computed(() => count() * 2);
  // Used with the cx:if directive
  const [show, setShow] = createSignal(true);
  // List of strings for the cxList helper
  const [items, setItems] = createSignal<string[]>(['one', 'two']);
  // For cx:show demonstration
  const [visible, setVisible] = createSignal(true);
  // For cx:model demonstration
  const nameSignal = createSignal('');
  // For cx:style demonstration
  const [color, setColor] = createSignal('red');

  return html`
    <style>
      .dark {
        background: #111;
        color: #eee;
      }
      .light {
        background: #fff;
        color: #111;
      }
    </style>
    <h1>Crux Feature Showcase</h1>

    <section>
      <h2>Event Directive (cx-on)</h2>
      <button cx-on:click=${() => setCount(count() + 1)}>
        Increment
      </button>
      <p>Count: ${cxText(() => count())}</p>
    </section>

    <section>
      <h2>Computed Signal</h2>
      <p>Double: ${cxText(() => doubleCount())}</p>
    </section>

    <section>
      <h2>Conditional Directive (cx:if)</h2>
      <button cx-on:click=${() => setShow(!show())}>Toggle message</button>
      <p cx:if=${() => show()}>Visible when show is true</p>
    </section>

    <section>
      <h2>List Rendering (cxList)</h2>
      <ul>
        ${cxList(() => items(), (item) => html`<li>${item}</li>`)}
      </ul>
      <button cx-on:click=${() =>
        setItems([...items(), `item ${items().length + 1}`])}
      >
        Add Item
      </button>
    </section>

    <section>
      <h2>Context & Reactive Attribute (cx:class)</h2>
      <p
        cx:class=${cxClass(() => theme() === 'dark', 'dark', 'light')}
        cx:title=${() => `Theme is ${theme()}`}
      >
        Theme: ${cxText(() => theme())}
      </p>
      <button cx-on:click=${() => setTheme(theme() === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <context-child></context-child>
    </section>

    <section>
      <h2>Show Directive (cx:show)</h2>
      <button cx-on:click=${() => setVisible(!visible())}>Toggle visibility</button>
      <p cx:show=${() => visible()}>I toggle display</p>
    </section>

    <section>
      <h2>Model Directive (cx:model)</h2>
      <input cx:model=${nameSignal} placeholder="Type your name" />
      <p>Name: ${cxText(() => nameSignal[0]())}</p>
    </section>

    <section>
      <h2>Style Directive (cx:style)</h2>
      <button cx-on:click=${() => setColor(color() === 'red' ? 'blue' : 'red')}>
        Toggle Color
      </button>
      <span cx:style:color=${() => color()}>This text changes color</span>
    </section>

    <section>
      <h2>For Directive (cx:for)</h2>
      <ul>
        <li cx:for=${() => items()}>Static item</li>
      </ul>
    </section>
  `;
});
