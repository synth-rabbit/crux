import { createSignal } from '@crux/reactivity';
import type { Signal } from '@crux/reactivity';

export type Validator<T> = (value: T) => string | null | undefined;
export type Validators<T> = { [K in keyof T]?: Validator<T[K]> };

export interface Field<T> {
  value: Signal<T>;
  error: Signal<string | null>;
}

export interface Form<T> {
  fields: { [K in keyof T]: Field<T[K]> };
  validate(): boolean;
  values(): T;
}

export function createForm<T extends Record<string, any>>(initial: T, validators: Validators<T> = {}): Form<T> {
  const fields = {} as { [K in keyof T]: Field<T[K]> };

  for (const key of Object.keys(initial) as (keyof T)[]) {
    const [val, setVal] = createSignal(initial[key]);
    const [err, setErr] = createSignal<string | null>(null);
    fields[key] = { value: [val, setVal], error: [err, setErr] } as Field<T[keyof T]>;
  }

  const validate = (): boolean => {
    let ok = true;
    for (const key of Object.keys(fields) as (keyof T)[]) {
      const validator = validators[key];
      const v = fields[key].value[0]();
      const msg = validator ? validator(v) : null;
      fields[key].error[1](msg ?? null);
      if (msg) ok = false;
    }
    return ok;
  };

  const values = (): T => {
    const result = {} as T;
    for (const key of Object.keys(fields) as (keyof T)[]) {
      result[key] = fields[key].value[0]();
    }
    return result;
  };

  return { fields, validate, values };
}
