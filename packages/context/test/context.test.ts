import { beforeEach, describe, expect, it } from 'vitest';

import {
  _resetContextStack,
  createContext,
  provide,
  useContext,
  withContextScope,
} from '../src/context';

describe('context', () => {
  beforeEach(() => {
    _resetContextStack();
  });

  it('returns default signal when no value is provided', () => {
    const ThemeContext = createContext('light');
    const signal = useContext(ThemeContext);
    expect(signal?.[0]()).toBe('light');
  });

  it('returns provided signal when in scope', () => {
    const ThemeContext = createContext('light');
    const providedValue = 'dark';

    withContextScope(() => {
      provide(ThemeContext, providedValue);
      const signal = useContext(ThemeContext);
      expect(signal?.[0]()).toBe('dark');
    });
  });

  it('returns outer signal if no inner override', () => {
    const ThemeContext = createContext('light');
    const outer = 'outer';
    const inner = 'inner';

    withContextScope(() => {
      provide(ThemeContext, outer);

      withContextScope(() => {
        // No inner override
        const signal = useContext(ThemeContext);
        expect(signal?.[0]()).toBe('outer');
      });

      withContextScope(() => {
        provide(ThemeContext, inner);
        const signal = useContext(ThemeContext);
        expect(signal?.[0]()).toBe('inner');
      });

      const signal = useContext(ThemeContext);
      expect(signal?.[0]()).toBe('outer');
    });
  });

  it('returns undefined if context was never provided and no default exists', () => {
    const NoDefaultContext = createContext<string>();
    const result = useContext(NoDefaultContext);
    expect(result).toBeUndefined();
  });

  it('context can be updated through signal setter', () => {
    const CountContext = createContext(0);

    withContextScope(() => {
      const signal = 5;
      provide(CountContext, signal);

      const [count, setCount] = useContext(CountContext)!;
      expect(count()).toBe(5);
      setCount(10);
      expect(count()).toBe(10);
    });
  });

  it('nested withContextScope restores correct outer context', () => {
    const LangContext = createContext('en');
    const outer = 'en';
    const inner = 'fr';

    withContextScope(() => {
      provide(LangContext, outer);
      expect(useContext(LangContext)?.[0]()).toBe('en');

      withContextScope(() => {
        provide(LangContext, inner);
        expect(useContext(LangContext)?.[0]()).toBe('fr');
      });

      expect(useContext(LangContext)?.[0]()).toBe('en');
    });
  });

  it('resetContextStack clears all context scopes', () => {
    const Ctx = createContext('init');

    withContextScope(() => {
      provide(Ctx, 'value');
      expect(useContext(Ctx)?.[0]()).toBe('value');
      _resetContextStack();
      expect(useContext(Ctx)?.[0]()).toBe('init');
    });
  });
});
