import CarPlate from "./CarPlate";
import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";
import UUID from "./UUID";

// Design Pattern - Facade, expoe um interface mais simples, delegando a complexidade interna para outros responsáveis
// Entity
export default class Account {
  private accountId: UUID;
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate?: CarPlate;
  private password: Password;
  
  constructor (accountId: string, name: string, email: string, cpf: string, carPlate: string, password: string, readonly isPassenger: boolean, readonly isDriver: boolean){
    this.accountId = new UUID(accountId);
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    if (isDriver) this.carPlate = new CarPlate(carPlate);
    this.password = new Password(password);
  }

  // Padrão static factory method
  static create (name: string, email: string, cpf: string, carPlate: string, password: string, isPassenger: boolean, isDriver: boolean) {
    const accountId = UUID.create();
    return new Account(accountId.getValue(), name, email, cpf, carPlate, password, isPassenger, isDriver);
  }

  getAccountId(){
    return this.accountId.getValue();
  }

  getName() {
    return this.name.getValue();
  }

  getEmail() {
    return this.email.getValue();
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getCarPlate(){
    return (this.isDriver) ? this.carPlate?.getValue() : "";
  }

  getPassword(){
    return this.password.getValue();
  }
}