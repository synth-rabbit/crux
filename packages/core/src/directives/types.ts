export interface Directive {
  match(attr: Attr): boolean;

  apply(el: Element, attr: Attr, expr: any): void;
}
