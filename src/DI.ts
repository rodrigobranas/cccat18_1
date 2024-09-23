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