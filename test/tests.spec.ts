import 'reflect-metadata';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';

describe('DependencyInjection', function() {
  let bootstrap: (mainClass: any) => any,
    provide: (token: string|symbol, options: Object) => void;

  beforeEach(function() {
    let di = require('../index');

    bootstrap = di.bootstrap;
    provide = di.provide;
  });

  afterEach(function() {
    let fileList = [
      '../index',
      '../src/main',
      './mocks/classWithDecoratedDependency.mock',
      './mocks/classWithDuplicateDependencies.mock',
      './mocks/classWithNestedDependencies.mock',
      './mocks/classWithNoDependency.mock',
      './mocks/classWithoutInjectableDecorator.mock',
      './mocks/classWithTypedDependency.mock',
      './mocks/duplicateDependency.mock',
      './mocks/nestedDependencyChild.mock',
      './mocks/nestedDependencyParent.mock',
      './mocks/providedDependency.mock',
      './mocks/typedDependency.mock'
    ];

    fileList.forEach((filename) => {
      delete require.cache[require.resolve(filename)];
    });
  });

  describe('when bootstrapping a class', function() {
    context('with no constructor parameters', function() {
      let ClassWithNoDependency: any,
        classWithNoDependencyConstructorSpy: SinonSpy;

      beforeEach(function() {
        let mock = require('./mocks/classWithNoDependency.mock');
        ClassWithNoDependency = mock.ClassWithNoDependency;
        classWithNoDependencyConstructorSpy = mock.classWithNoDependencyConstructorSpy;
        bootstrap(ClassWithNoDependency);
      });

      it('should instantiate the class', function() {
        expect(classWithNoDependencyConstructorSpy.calledOnce).to.be.true;
      });

      it('should instantiate the class with no params', function() {
        expect(classWithNoDependencyConstructorSpy.firstCall.args.length).to.equal(0);
      });

      it('should return the class instance', function() {
        expect(bootstrap(ClassWithNoDependency)).to.be.an.instanceOf(ClassWithNoDependency);
      });
    });

    context('with a typed constructor parameter', function() {
      let ClassWithTypedDependency: any,
        classWithTypedDependencyConstructorSpy: SinonSpy,
        TypedDependency: any,
        typedDependencyConstructorSpy: SinonSpy;

      beforeEach(function() {
        let classMock = require('./mocks/classWithTypedDependency.mock');
        ClassWithTypedDependency = classMock.ClassWithTypedDependency;
        classWithTypedDependencyConstructorSpy = classMock.classWithTypedDependencyConstructorSpy;

        let typedDependencyMock = require('./mocks/typedDependency.mock');
        TypedDependency = typedDependencyMock.TypedDependency;
        typedDependencyConstructorSpy = typedDependencyMock.typedDependencyConstructorSpy;

        bootstrap(ClassWithTypedDependency);
      });

      it('should create an instance of the dependency', function() {
        expect(typedDependencyConstructorSpy.calledOnce);
      });

      it('should instantiate the class', function() {
        expect(classWithTypedDependencyConstructorSpy.calledOnce).to.be.true;
      });

      it('should instantiate the class with one parameter', function() {
        expect(classWithTypedDependencyConstructorSpy.firstCall.args.length).to.equal(1);
      });

      it('should instantiate the class with an instance of the dependency type', function() {
        expect(classWithTypedDependencyConstructorSpy.firstCall.args[0]).to.be.an.instanceOf(TypedDependency);
      });
    });

    context('with a decorated constructor parameter', function() {
      context('that has already been provided', function() {
        context('as value', function() {
          let ClassWithDecoratedDependency: any,
            classWithDecoratedDependencyConstructorSpy: SinonSpy,
            ProvidedDependencyToken: symbol,
            valueProvidedDependency: any;

          beforeEach(function() {
            let classMock = require('./mocks/classWithDecoratedDependency.mock');
            ClassWithDecoratedDependency = classMock.ClassWithDecoratedDependency;
            classWithDecoratedDependencyConstructorSpy = classMock.classWithDecoratedDependencyConstructorSpy;

            let providedDependencyMock = require('./mocks/providedDependency.mock');
            ProvidedDependencyToken = providedDependencyMock.ProvidedDependencyToken;
            valueProvidedDependency = providedDependencyMock.valueProvidedDependency;

            provide(ProvidedDependencyToken, {
              useValue: valueProvidedDependency
            });

            bootstrap(ClassWithDecoratedDependency);
          });

          it('should instantiate the class', function() {
            expect(classWithDecoratedDependencyConstructorSpy.calledOnce).to.be.true;
          });

          it('should instantiate the class with one parameter', function() {
            expect(classWithDecoratedDependencyConstructorSpy.firstCall.args.length).to.equal(1);
          });

          it('should instantiate the class with an instance of the dependency type', function() {
            expect(classWithDecoratedDependencyConstructorSpy.firstCall.args[0]).to.equal(valueProvidedDependency);
          });
        });

        context('as factory', function() {
          let ClassWithDecoratedDependency: any,
            classWithDecoratedDependencyConstructorSpy: SinonSpy,
            ProvidedDependencyToken: symbol,
            factoryProvidedDependency: any,
            factoryProvidedDependencyStub: SinonStub;

          beforeEach(function() {
            let classMock = require('./mocks/classWithDecoratedDependency.mock');
            ClassWithDecoratedDependency = classMock.ClassWithDecoratedDependency;
            classWithDecoratedDependencyConstructorSpy = classMock.classWithDecoratedDependencyConstructorSpy;

            let providedDependencyMock = require('./mocks/providedDependency.mock');
            ProvidedDependencyToken = providedDependencyMock.ProvidedDependencyToken;
            factoryProvidedDependency = providedDependencyMock.factoryProvidedDependency;
            factoryProvidedDependencyStub = providedDependencyMock.factoryProvidedDependencyStub;

            factoryProvidedDependencyStub.returns(factoryProvidedDependency);

            provide(ProvidedDependencyToken, {
              useFactory: factoryProvidedDependencyStub
            });

            bootstrap(ClassWithDecoratedDependency);
          });

          it('should instantiate the class', function() {
            expect(classWithDecoratedDependencyConstructorSpy.calledOnce).to.be.true;
          });

          it('should instantiate the class with one parameter', function() {
            expect(classWithDecoratedDependencyConstructorSpy.firstCall.args.length).to.equal(1);
          });

          it('should instantiate the class with an instance of the dependency type', function() {
            expect(classWithDecoratedDependencyConstructorSpy.firstCall.args[0]).to.equal(factoryProvidedDependency);
          });
        });
      });

      context('that has not been provided', function() {
        let ClassWithDecoratedDependency: any,
          classWithDecoratedDependencyConstructorSpy: SinonSpy;

        beforeEach(function() {
          let mock = require('./mocks/classWithDecoratedDependency.mock');
          ClassWithDecoratedDependency = mock.ClassWithDecoratedDependency;
          classWithDecoratedDependencyConstructorSpy = mock.classWithDecoratedDependencyConstructorSpy;
        });

        it('should throw an error with the name of the missing token', function() {
          expect(function() {
            bootstrap(ClassWithDecoratedDependency);
          }).to.throw(Error, `Dependency 'providedDependency' could not be found.`);
        });
      });

      context('that is undefined', function() {
        let ClassWithUndefinedDecoratedDependency: any,
          classWithUndefinedDecoratedDependencyConstructorSpy: SinonSpy;

        beforeEach(function() {
          let mock = require('./mocks/classWithUndefinedDecoratedDependency.mock');
          ClassWithUndefinedDecoratedDependency = mock.ClassWithUndefinedDecoratedDependency;
          classWithUndefinedDecoratedDependencyConstructorSpy = mock.classWithUndefinedDecoratedDependencyConstructorSpy;
        });

        it('should throw an error with the name of the missing token', function() {
          expect(function() {
            bootstrap(ClassWithUndefinedDecoratedDependency);
          }).to.throw(Error, `Dependency 'undefined' could not be found.`);
        });
      });
    });

    context('with nested dependencies', function() {
      let ClassWithNestedDependencies: any,
        classWithNestedDependenciesConstructorSpy: SinonSpy,
        NestedDependencyParent: any,
        nestedDependencyParentConstructorSpy: SinonSpy,
        NestedDependencyChild: any,
        nestedDependencyChildConstructorSpy: SinonSpy;

      beforeEach(function() {
        let classMock = require('./mocks/classWithNestedDependencies.mock');
        ClassWithNestedDependencies = classMock.ClassWithNestedDependencies;
        classWithNestedDependenciesConstructorSpy = classMock.classWithNestedDependenciesConstructorSpy;

        let nestedParentMock = require('./mocks/nestedDependencyParent.mock');
        NestedDependencyParent = nestedParentMock.NestedDependencyParent;
        nestedDependencyParentConstructorSpy = nestedParentMock.nestedDependencyParentConstructorSpy;

        let nestedChildMock = require('./mocks/nestedDependencyChild.mock');
        NestedDependencyChild = nestedChildMock.NestedDependencyChild;
        nestedDependencyChildConstructorSpy = nestedChildMock.nestedDependencyChildConstructorSpy;

        bootstrap(ClassWithNestedDependencies);
      });

      it('should instantiate all nested dependencies', function() {
        expect(nestedDependencyChildConstructorSpy.calledOnce).to.be.true;
        expect(nestedDependencyParentConstructorSpy.calledOnce).to.be.true;
        expect(classWithNestedDependenciesConstructorSpy.calledOnce).to.be.true;
      });

      it('should use the instances to instantiate the bootstrapped class', function() {
        expect(nestedDependencyParentConstructorSpy.firstCall.args[0]).to.be.an.instanceOf(NestedDependencyChild);
        expect(classWithNestedDependenciesConstructorSpy.firstCall.args[0]).to.be.an.instanceOf(NestedDependencyParent);
      });
    });

    context('with a constructor parameter that has already been instantiated', function() {
      let ClassWithDuplicateDependencies: any,
        classWithDuplicateDependenciesConstructorSpy: SinonSpy,
        DuplicateDependency: any;

      beforeEach(function() {
        let classMock = require('./mocks/classWithDuplicateDependencies.mock');
        ClassWithDuplicateDependencies = classMock.ClassWithDuplicateDependencies;
        classWithDuplicateDependenciesConstructorSpy = classMock.classWithDuplicateDependenciesConstructorSpy;

        let duplicateDependencyMock = require('./mocks/duplicateDependency.mock');
        DuplicateDependency = duplicateDependencyMock.DuplicateDependency;

        bootstrap(ClassWithDuplicateDependencies);
      });

      it('should inject the same instance into both classes', function() {
        expect(classWithDuplicateDependenciesConstructorSpy.calledOnce).to.be.true;

        expect(classWithDuplicateDependenciesConstructorSpy.firstCall.args.length).to.equal(2);

        let firstArgument = classWithDuplicateDependenciesConstructorSpy.firstCall.args[0];
        let secondArgument = classWithDuplicateDependenciesConstructorSpy.firstCall.args[1];

        expect(firstArgument).to.be.an.instanceOf(DuplicateDependency);
        expect(secondArgument).to.be.an.instanceOf(DuplicateDependency);

        expect(firstArgument).to.equal(secondArgument);
      });
    });

    context('with no param type metadata', function() {
      let ClassWithoutInjectableDecorator: any;

      beforeEach(function() {
        let mock = require('./mocks/classWithoutInjectableDecorator.mock');
        ClassWithoutInjectableDecorator = mock.ClassWithoutInjectableDecorator;
      });

      it('should throw an error with the name of the class', function() {
        expect(function() {
          bootstrap(ClassWithoutInjectableDecorator);
        }).to.throw(Error, 'ClassWithoutInjectableDecorator');
      });
    });
  });

  describe('provide', function(){
    context('when called', function() {
      context('with no token', function() {
        it('should throw an error', function() {
          expect(function() {
            provide(undefined, { useValue: null });
          }).to.throw(Error, `No provide method has been chosen, cannot provide dependency 'undefined'`);
        });
      });

      context('with no provide method', function() {
        it('should throw an error', function() {
          expect(function() {
            provide('should fail', {});
          }).to.throw(Error, `No provide method has been chosen, cannot provide dependency 'should fail'`);
        });
      });
    });
  });
});
