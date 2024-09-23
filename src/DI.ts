/*
* Padrão de Projeto Regitry:
* Um objeto muito conhecido que é usado para localizar outros objetos
*/
export class Registry {
  dependencies: {[name: string]: any};
  private static instance: Registry;

  constructor () {
    this.dependencies = {};
  }

  provide (name: string, dependency: any){
    this.dependencies[name] = dependency;
  }

  inject (name: string) {
    return this.dependencies[name]
  }
  // Padrão de Projeto Singleton
  static getInstance () {
    if(!Registry.instance){
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }
}

// typescript Decorator
export function inject (name: string) {
  /*
  * target: objeto em si.
  * propertyKey propriedade onde aplica o decorator
  * implementado em Signup.ts 
   */
  return function(target: any, propertyKey: string){
    // Cria um objeto, permitindo acessar as propriedades do Objeto, podendo fazer coisas nesse meio tempo, entre acessar e retornar
    target[propertyKey] = new Proxy({}, {
      get (target: any, propertyKey: string){
        const dependecy = Registry.getInstance().inject(name);
        return dependecy[propertyKey];
      }
    })
  }
}