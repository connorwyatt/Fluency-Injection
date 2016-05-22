import {SinonSpy, spy} from 'sinon';
import { Injectable } from '../../index';

export const nestedDependencyChildConstructorSpy: SinonSpy = spy();

@Injectable
export class NestedDependencyChild {
  constructor() {
    nestedDependencyChildConstructorSpy(...arguments);
  }
}
