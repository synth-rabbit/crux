import { Directive } from './types';
import { eventDirective } from './event';
import { reactiveAttrDirective } from './reactiveAttr';
import { ifDirective } from './if';

export const allDirectives: Directive[] = [eventDirective, reactiveAttrDirective, ifDirective];
