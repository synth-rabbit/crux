export type ReactiveEffect = () => void;
export type Accessor<T> = () => T;
export type Setter<T> = (value: T) => void;
export type Signal<T> = [Accessor<T>, Setter<T>];
