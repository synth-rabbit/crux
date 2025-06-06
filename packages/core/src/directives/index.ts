import { Directive } from './types';
import { eventDirective } from './event';
import { reactiveAttrDirective } from './reactiveAttr';
import { ifDirective } from './if';
import { forDirective } from './for';
import { showDirective } from './show';
import { modelDirective } from './model';
import { styleDirective } from './style';

export const allDirectives: Directive[] = [
  eventDirective,
  reactiveAttrDirective,
  ifDirective,
  forDirective,
  showDirective,
  modelDirective,
  styleDirective,
];
