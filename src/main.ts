import 'reflect-metadata';

let dependencyStore: Map<any, any> = new Map<any, any>();

const $dependencies: string = '$dependencies';

export function bootstrap(mainClass: any): any {
  return instantiateClass(mainClass);
}

export interface ProvideConfig {
  useValue?: any;
}

export function provide(token: string|symbol, options: ProvideConfig): void {
  let value: any;

  value = options.useValue;

  dependencyStore.set(token, value);
}

export function Inject(token: any) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
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
    resolvedDependency = dependencyStore.get(token);
  } else {
    resolvedDependency = instantiateClass(token);
    dependencyStore.set(token, resolvedDependency);
  }

  if (!resolvedDependency) {
    let errorMessage = `Dependency '${token.toString()}' could not be found.`;
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
