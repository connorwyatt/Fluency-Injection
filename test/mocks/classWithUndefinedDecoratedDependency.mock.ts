import {SinonSpy, spy} from 'sinon';
import { Injectable, Inject } from '../../index';

export const classWithUndefinedDecoratedDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class ClassWithUndefinedDecoratedDependency {
  constructor(@Inject(undefined) providedDependency: any) {
    const args = arguments as any;
    classWithUndefinedDecoratedDependencyConstructorSpy(...args);
  }
}
