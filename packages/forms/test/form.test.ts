import { describe, it, expect } from 'vitest';
import { createForm } from '../src/form';

describe('createForm', () => {
  it('tracks field values', () => {
    const form = createForm({ name: 'a' });
    form.fields.name.value[1]('b');
    expect(form.fields.name.value[0]()).toBe('b');
  });

  it('validates fields', () => {
    const form = createForm(
      { name: '' },
      { name: (v) => (v ? null : 'required') }
    );

    expect(form.validate()).toBe(false);
    expect(form.fields.name.error[0]()).toBe('required');

    form.fields.name.value[1]('John');
    expect(form.validate()).toBe(true);
    expect(form.fields.name.error[0]()).toBe(null);
  });
});
