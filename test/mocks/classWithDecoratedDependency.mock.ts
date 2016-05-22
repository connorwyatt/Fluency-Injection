import {SinonSpy, spy} from 'sinon';
import { Injectable, Inject } from '../../index';
import { ProvidedDependencyToken } from './providedDependency.mock';

export const classWithDecoratedDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithDecoratedDependency {
  constructor(@Inject(ProvidedDependencyToken) providedDependency: any) {
    classWithDecoratedDependencyConstructorSpy(...arguments);
  }
}
