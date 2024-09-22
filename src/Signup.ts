import AccountDAO from "./AccountDAO";
import Account from "./Account";

export default class Signup {

  constructor (readonly accountDAO: AccountDAO){

  }
  
  async execute(input: any){
    
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
    const accountData = await this.accountDAO.getAccountByEmail(input.email)
    if (accountData) throw new Error("Duplicated account");
    await this.accountDAO.saveAccount(account);
    return {
      accountId: input.accountId
    };
  }
}
