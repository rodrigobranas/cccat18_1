import DatabaseConnection from "../database/DataBaseConnection";
import { inject } from "../DI/DI";
import Account from "../../domain/Account"


// Port
export default interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountId: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

// Adapter
export class AccountRepositoryDatabase implements AccountRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;
  
  async getAccountByEmail(email: string){
    const [accountData] = await this.connection?.query("select * from ccca.account where email = $1", [email]);
    if (!accountData) return;
    return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.password, accountData.is_passenger, accountData.is_driver);
  }
  
  async getAccountById(accountId: string){
    const [accountData] = await this.connection?.query("select * from ccca.account where account_id = $1", [accountId]);
    return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.password, accountData.is_passenger, accountData.is_driver);
  }
  
  async saveAccount(account: Account){
    await this.connection?.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.getAccountId(), account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver, account.getPassword()]);
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: any[];

  constructor () {
    this.accounts = [];
  }
  
  async getAccountByEmail(email: string): Promise<any> {
    return this.accounts.find((account: any) => account.email === email);
  }
  async getAccountById(accountId: string): Promise<any> {
    return this.accounts.find((account: any) => account.getAccountId() === accountId);
  }
  async saveAccount(account: any): Promise<any> {
    this.accounts.push(account);
  }

}
