import AccountDAO from "./AccountDAO";

/*
* export default: diz para que exportat tudo, e não somente por quem deseja.
*/
export default class GetAccount {
  
  constructor (readonly accountDAO: AccountDAO) {
  }

  async execute(accountId: string){
    const accountData = await this.accountDAO.getAccountById(accountId);
    return accountData;
  }
}