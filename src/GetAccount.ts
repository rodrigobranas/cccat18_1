import AccountRepository from "./AccountRepository";

/*
* export default: diz para que exportat tudo, e não somente por quem deseja.
*/
export default class GetAccount {
  
  constructor (readonly accountRepository: AccountRepository) {
  }

  async execute(accountId: string){
    const account = await this.accountRepository.getAccountById(accountId);
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