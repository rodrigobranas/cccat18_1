// Entity
export default class Name {
  private value: string;

  constructor(value: string){
    if (!value.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    this.value = value;
  }

  getValue () {
    return this.value;
  }
}