import { defineComponent, html, cxText } from '@crux/core';
import { createForm } from '@crux/forms';

export interface DemoData {
  name: string;
  email: string;
  message: string;
}

defineComponent('demo-form', () => {
  const form = createForm<DemoData>(
    { name: '', email: '', message: '' },
    {
      name: (v) => (v ? null : 'Name is required'),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
      message: (v) => (v ? null : 'Message required'),
    }
  );

  const submit = (e: Event) => {
    e.preventDefault();
    if (form.validate()) {
      alert(JSON.stringify(form.values()));
    }
  };

  return html`
    <form cx-on:submit=${submit} novalidate>
      <div>
        <label>
          Name
          <input cx:model=${form.fields.name.value} />
        </label>
        <p cx:show=${() => !!form.fields.name.error[0]()} style="color: red">
          ${cxText(() => form.fields.name.error[0]())}
        </p>
      </div>
      <div>
        <label>
          Email
          <input type="email" cx:model=${form.fields.email.value} />
        </label>
        <p cx:show=${() => !!form.fields.email.error[0]()} style="color: red">
          ${cxText(() => form.fields.email.error[0]())}
        </p>
      </div>
      <div>
        <label>
          Message
          <textarea cx:model=${form.fields.message.value}></textarea>
        </label>
        <p cx:show=${() => !!form.fields.message.error[0]()} style="color: red">
          ${cxText(() => form.fields.message.error[0]())}
        </p>
      </div>
      <button type="submit">Submit</button>
    </form>
  `;
});
