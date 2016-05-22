import {SinonSpy, spy} from 'sinon';
import { Injectable } from '../../index';
import { NestedDependencyChild } from './nestedDependencyChild.mock';

export const nestedDependencyParentConstructorSpy: SinonSpy = spy();

@Injectable
export class NestedDependencyParent {
  constructor(nestedDependencyChild: NestedDependencyChild) {
    nestedDependencyParentConstructorSpy(...arguments);
  }
}
