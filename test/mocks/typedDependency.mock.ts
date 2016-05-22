import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';

export const typedDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class TypedDependency {
  constructor() {
    typedDependencyConstructorSpy(...arguments);
  }
}
