import Account from "../../domain/Account";
import { inject } from "../../infra/DI/DI";
import AccountRepository from "../../infra/Repository/AccountRepository";



//Use Case
export default class Signup {
  @inject("accountRepository")
  accountRepository?: AccountRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: any){
    // Orquestrar entitidades - "Oquestrate the dance of the entities" Bob
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
    // Orquestrando recursos
    const accountData = await this.accountRepository?.getAccountByEmail(input.email)
    if (accountData) throw new Error("Duplicated account");
    await this.accountRepository?.saveAccount(account);
    return {
      accountId: account.getAccountId()
    };
  }
}