import { cxText, defineComponent, html } from '@crux/core';
import { useContext } from '@crux/context';
import { ThemeContext } from '../context/ThemeContext';

// Demonstrates using context in a child component
defineComponent('context-child', () => {
  const [theme] = useContext(ThemeContext)!;
  return html`<p>Child reads theme: ${cxText(() => theme())}</p>`;
});
