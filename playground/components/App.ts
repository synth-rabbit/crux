import { defineComponent, html } from '@crux/core';
import { provide } from '@crux/context';
import { ThemeContext } from '../context/ThemeContext';
import './ChildComponent';
import './ClickCounter';

defineComponent('my-app', () => {
  provide(ThemeContext, 'dark');

  return html`
    <div>
      <h1>Main App</h1>
      <child-component></child-component>
      <click-counter></click-counter>
    </div>
  `;
});
