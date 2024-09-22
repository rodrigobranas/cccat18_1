import crypto from "crypto";
import CarPlate from "./CarPlate";
import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";

export default class Account {
  
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate;
  private password: Password;
  
  constructor (readonly accountId: string, name: string, email: string, cpf: string, carPlate: string, password: string, readonly isPassenger: boolean, readonly isDriver: boolean){
    
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.carPlate = new CarPlate(carPlate);
    this.password = new Password(password);
    
  }

  // Padrão static factory method
  static create (name: string, email: string, cpf: string, carPlate: string, password: string, isPassenger: boolean, isDriver: boolean) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, carPlate, password, isPassenger, isDriver);
  }

  getEmail() {
    return this.email.getValue();
  }
}