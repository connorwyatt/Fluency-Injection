import 'reflect-metadata';

let dependencyStore: Map<any, DependencyDefinition> = new Map<any, DependencyDefinition>();

const $dependencies: string = '$dependencies';

export function bootstrap(mainClass: any): any {
  return instantiateClass(mainClass);
}

export interface ProvideConfig {
  useFactory?: () => any;
  useValue?: any;
}

interface DependencyDefinition {
  factory?: () => any;
  value?: any;
}

export function provide(token: any, options: ProvideConfig): void {
  let dependencyDefinition: DependencyDefinition = {};

  if (options.useValue) {
    dependencyDefinition.value = options.useValue;
  } else if (options.useFactory) {
    dependencyDefinition.factory = options.useFactory;
  } else {
    let errorMessage = `No provide method has been chosen, cannot provide dependency '${ token.toString() }'.`;
    throw new Error(errorMessage);
  }

  dependencyStore.set(token, dependencyDefinition);
}

export function Inject(token: any) {
  return function(target: any, propertyKey: any, parameterIndex: number) {
    processDependency(token, target, parameterIndex);
  }
}

export function Injectable(target: any) {
}

function processDependency(token: any, target: any, parameterIndex: number): void {
  Reflect.defineMetadata(parameterIndex, token, target, $dependencies);
}

function getDependencies(target: any): Array<any> {
  let paramTypes = Reflect.getMetadata('design:paramtypes', target);

  if (!paramTypes) {
    let errorMessage = `Parameter type metadata not available for '${target.name}', use the @Injectable decorator.`;
    throw new Error(errorMessage);
  } else {
    return paramTypes.map((value: any, index: number) => {
      let token: any;

      if (Reflect.hasMetadata(index, target, $dependencies)) {
        token = Reflect.getMetadata(index, target, $dependencies);
      } else {
        token = value;
      }

      return resolveDependency(token);
    });
  }
}

function resolveDependency(token: any): any {
  let resolvedDependency: any;

  if (dependencyStore.has(token)) {
    let dependencyDefinition: DependencyDefinition = dependencyStore.get(token);

    if (dependencyDefinition.value) {
      resolvedDependency = dependencyDefinition.value;
    } else {
      resolvedDependency = dependencyDefinition.factory();
    }
  } else {
    resolvedDependency = instantiateClass(token);
    dependencyStore.set(token, { value: resolvedDependency });
  }

  if (!resolvedDependency) {
    let errorMessage = `Dependency '${ token.toString() }' could not be found.`;
    throw new Error(errorMessage);
  }

  return resolvedDependency;
}

function instantiateClass(Class: any): any {
  if (typeof Class === 'function') {
    let dependencies = getDependencies(Class);

    return new Class(...dependencies);
  }
}
