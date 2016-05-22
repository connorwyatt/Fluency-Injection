import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';
import { DuplicateDependency } from './duplicateDependency.mock';

export const classWithDuplicateDependenciesConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithDuplicateDependencies {
  constructor(dependency1: DuplicateDependency, dependency2: DuplicateDependency) {
    classWithDuplicateDependenciesConstructorSpy(...arguments);
  }
}
