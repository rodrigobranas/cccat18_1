import { inject } from "../../infra/DI/DI";
import AccountRepository from "../../infra/Repository/AccountRepository";


/*
* export default: diz para que exportat tudo, e não somente por quem deseja.
*/
export default class GetAccount {
  
  @inject("accountRepository")
  accountRepository?: AccountRepository;


  async execute(accountId: string){
    const account = await this.accountRepository?.getAccountById(accountId);
    if (!account) throw new Error("Account not found")
    // DTO - Data Transfer Object
    return {
      accountId: account.getAccountId(),
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      password: account.getPassword(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
    }
  }
}