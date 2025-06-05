import { cxClass, cxList, cxText, defineComponent, html } from '@crux/core';
import { useContext } from '@crux/context';
import { computed, createSignal } from '@crux/reactivity';
import { ThemeContext } from '../context/ThemeContext';

defineComponent('child-component', () => {
  const [theme, setTheme] = useContext(ThemeContext);
  const words = ['hello', 'world'];
  const [potatoes, setPotatoes] = createSignal<string[]>(['bob', 'jim', 'tommy']);
  const potatoCount = computed(() => potatoes().length);

  return html`
    <div>
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

      <p cx:class=${cxClass(() => theme() === 'dark', 'dark', 'light')}>
        Theme is ${cxText(() => theme())}
      </p>

      <ul>
        ${cxList(
          () => words,
          (word) => html` <li>${word}</li>`
        )}
      </ul>

      <h1 cx:if=${() => theme() === 'dark'}>It is dark</h1>
      <h2>${cxText(() => potatoCount())}</h2>

      <ul>
        ${cxList(
          () => potatoes(),
          (p) => html` <li>${p}</li>`
        )}
      </ul>

      <button cx-on:click=${() => setTheme(theme() === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <button cx-on:click=${() => setPotatoes([...potatoes(), 'jimmy'])}>Add Jimmy</button>
    </div>
  `;
});
