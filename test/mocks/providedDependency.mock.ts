import { SinonStub, stub } from 'sinon';

export const ProvidedDependencyToken = Symbol('providedDependency');

export const valueProvidedDependency = {
  name: 'providedDependency'
};

export const factoryProvidedDependencyStub: SinonStub = stub();

export const factoryProvidedDependency = {};
