// Entity
export default class Cpf {
  
  CPF_VALID_LENGTH = 11;
  FIRST_DIGIT_FACTOR = 10;
  SECOND_DIGIT_FACTOR = 11;

  private value: string;

  constructor(value: string){
    if (!this.validate(value)) throw new Error("Invalid CPF");
    this.value = value;
  }

  validate (cpf: string) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== this.CPF_VALID_LENGTH) return false;
    if (this.allDigitsTheSame(cpf)) return false;
    const digit1 = this.calculateDigit(cpf, this.FIRST_DIGIT_FACTOR);
    const digit2 = this.calculateDigit(cpf, this.SECOND_DIGIT_FACTOR);
    return `${digit1}${digit2}` === this.extractDigit(cpf);
  }

  allDigitsTheSame (cpf: string) {
    const [firstDigit] = cpf;
    return [...cpf].every(digit => digit === firstDigit);
  }

  calculateDigit (cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const remainder = total % 11;
    return (remainder < 2) ? 0 : 11 - remainder;
  }

  extractDigit (cpf: string) {
    return cpf.slice(9);
  }


  getValue () {
    return this.value;
  }
}

