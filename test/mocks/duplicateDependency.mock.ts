import { SinonSpy, spy } from 'sinon';
import { Injectable } from '../../index';

export const duplicateDependencyConstructorSpy: SinonSpy = spy();

@Injectable
export class DuplicateDependency {
  constructor() {
    duplicateDependencyConstructorSpy(...arguments);
  }
}
