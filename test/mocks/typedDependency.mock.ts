import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';

export const typedDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class TypedDependency {
  constructor() {
    const args = arguments as any;
    typedDependencyConstructorSpy(...args);
  }
}
