import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';

export const classWithNoDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithNoDependency {
  constructor() {
    classWithNoDependencyConstructorSpy(...arguments);
  }
}
