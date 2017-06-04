import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';

export const classWithNoDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithNoDependency {
  constructor() {
    const args = arguments as any;
    classWithNoDependencyConstructorSpy(...args);
  }
}
