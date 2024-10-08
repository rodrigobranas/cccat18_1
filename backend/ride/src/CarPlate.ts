export class CarPlate {
  private value: string

  constructor(value: string) {
    if(!value.match(/[A-Z]{3}[0-9]{4}/)) {
      throw new Error("Invalid car plate")
    }

    this.value = value
  }

  getValue() {
    return this.value
  }
}