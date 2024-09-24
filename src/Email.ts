// Entity
export default class Email {
  private value: string;

  constructor(value: string){
    if (!value.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    this.value = value;
  }

  getValue () {
    return this.value;
  }
}