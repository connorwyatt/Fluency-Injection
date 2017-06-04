import { SinonStub, stub } from 'sinon';

// Would use Symbol() in ES6, string in ES5
export const ProvidedDependencyToken = 'providedDependency';

export const valueProvidedDependency = {
  name: 'providedDependency'
};

export const factoryProvidedDependencyStub: SinonStub = stub();

export const factoryProvidedDependency = {};
