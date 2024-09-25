// Entity
export default class CarPlate {
  private value: string;

  constructor(value: string){
    if (!value.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid Car Plate");
    this.value = value;
  }

  getValue () {
    return this.value;
  }
}