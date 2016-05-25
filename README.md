# Fluency Injection
A TypeScript dependency injection framework for Node.js, inspired by Angular2 dependency injection using decorators.

It is designed to make Node.js dependency injection more fluid by using TypeScript decorators.

## Inspiration
Any users that have built applications with Angular2 may notice some similarities between this framework and the Angular2 dependency injection framework.

Firstly it uses the same decorator (e.g. `@Inject()` and `@Injectable`) and method (e.g. `bootstrap()` and `provide()`) names in order to keep a consistent API as I envisage this framework being used in node applications, meaning that you may be using both this framework and Angular2 in the same app.

Secondly, the mechanism for getting the constructor parameter types uses the [Reflect Metadata](https://github.com/rbuckton/ReflectDecorators) library, which is also used by Angular2.

## Why Use This Library?

1. It makes providing dependencies to classes much more readable and avoids spaghetti-code.
2. Unit testing becomes very easy as you can test the class by creating a new instance of it, providing mocked dependencies in order to control the flow of the class logic.
3. It will feel familiar with users of Angular2.

## Installation
- Install the `fluency-injection` package using `npm install --save fluency-injection`.
- Make sure to also install the `reflect-metadata` package using `npm install --save reflect-metadata` as it is a peer dependency of the framework.

## Documentation

### tsconfig.json

In your `tsconfig.json` file make sure to enable the `experimentalDecorators` and `emitDecoratorMetadata` options as these are required for Reflect to get the constructor parameter types.

```
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

*For more information see the [tsconfig documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html).*

### Bootstrapping the Main Class

To initialise the IoC container, call the bootstrap method with the Main Class.

This initialises the Main Class and resolves all dependencies recursively.

```TypeScript
import { Injectable, bootstrap } from 'fluency-injection';

@Injectable
class TestDependency {
  constructor() {}

  public sayHello() {
    console.log('Hello!');
  }
}

class Main {
  constructor(testDependency: TestDependency) {
    testDependency.sayHello();
  }
}

bootstrap(Main);
```

The above example will attempt to initialise the `Main` class by creating an instance of the `TestDependency` class (and so on, until all dependencies have been provided).

The output will be `'Hello'`.

*Note: All dependencies are singletons so if you wish to create new instances, create a factory class or provide the class as a value (see below).*

*In the example above, if another class tried to inject the `TestDependency` class, it would receive the same instance as the `Main` class.*

### Providing Custom Dependencies

Sometimes you may need to inject an external library into a class (e.g. a logging framework).

In order to do this, call the provide method with a token (can be any unique value) and an object with either the value you wish to provide to the classes that try to inject using the token, or a factory function which be executed for each injection and must return the depedency.

```TypeScript
import { Inject, bootstrap, provide } from 'fluency-injection';
import * as externalLibrary from 'external-library';
import * as anotherExternalLibrary from 'another-external-library';

let Token = Symbol('token'),
  AnotherToken = Symbol('anotherToken');

provide(Token, {
  useValue: externalLibrary
});

provide(AnotherToken, {
  useFactory: () => {
    return new anotherExternalLibrary();
  }
});

class Main {
  constructor(@Inject(Token) externalLibrary: any,
              @Inject(AnotherToken) anotherExternalLibrary: any) {
    console.log(externalLibrary); // Will be the value provided to the application using the provide method.
    console.log(anotherExternalLibrary); // Will be the value returned by the factory function passed to the provide method.
  }
}

bootstrap(Main);
```

In the above example the provide method is used to make the dependency injection framework aware of what to inject when you use the token with the Inject decorator.

The `@Inject` decorator is then used to tell the framework that you want the value that was provided using the token to be injected as a a constructor parameter.

*Note: The token must be unique as it is used to store the value, and used to retrieve it. As such, a good practice is to create a `tokens` directory that exports symbols that can then be used to both provide and inject the dependency.*

### The @Injectable Decorator

Due to the way that TypeScript works, metadata for the constructor parameters is only output when there are decorators in the file. As such, if you don't use any decorators in a file the dependency injection framework won't be able to use the parameter types to inject the correct dependecies.

To output the metadata for the file, use the `@Injectable` decorator.

Better still, use the `@Injectable` decorator on all injectable classes.

```TypeScript
import { Injectable } from 'fluency-injection';

@Injectable
class Dependency {}
```

## Contact

Feel free to raise issues in the issue tracker on GitHub or email me for support at [connorwyatt1@gmail.com](mailto:connorwyatt1@gmail.com).
