import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';
import { TypedDependency } from './typedDependency.mock';

export const classWithTypedDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithTypedDependency {
  constructor(typedDependency: TypedDependency) {
    classWithTypedDependencyConstructorSpy(...arguments);
  }
}
