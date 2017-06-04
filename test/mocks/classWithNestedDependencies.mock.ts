import {SinonSpy, spy} from 'sinon';
import { Injectable } from '../../index';
import { NestedDependencyParent } from './nestedDependencyParent.mock';

export const classWithNestedDependenciesConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithNestedDependencies {
  constructor(nestedDependencyParent: NestedDependencyParent) {
    const args = arguments as any;
    classWithNestedDependenciesConstructorSpy(...args);
  }
}
