import { describe, expect, it } from 'vitest';
import { createStore } from '../src/store';

describe('createStore', () => {
  it('initializes signals for each property', () => {
    const store = createStore({ count: 0, text: 'a' });
    store.state.count[1](1);
    store.state.text[1]('b');
    expect(store.state.count[0]()).toBe(1);
    expect(store.state.text[0]()).toBe('b');
  });

  it('setState updates multiple properties', () => {
    const store = createStore({ a: 1, b: 2 });
    store.setState({ a: 3, b: 4 });
    expect(store.getState()).toEqual({ a: 3, b: 4 });
  });

  it('getState returns current values', () => {
    const store = createStore({ a: 0, b: '' });
    store.state.a[1](1);
    expect(store.getState()).toEqual({ a: 1, b: '' });
  });
});
