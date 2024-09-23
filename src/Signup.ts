import Account from "./Account";
import AccountRepository from "./AccountRepository";
import { Registry } from "./DI";

export default class Signup {
  //@inject("accountRepository")
  accountRepository?: AccountRepository;

  constructor (){
    this.accountRepository = Registry.getInstance().inject("accountRepository");
  }
  // Dependency Inversion Principle - Dependency Injection
  async execute(input: any){
    
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
    const accountData = await this.accountRepository?.getAccountByEmail(input.email)
    if (accountData) throw new Error("Duplicated account");
    await this.accountRepository?.saveAccount(account);
    return {
      accountId: account.getAccountId()
    };
  }
}