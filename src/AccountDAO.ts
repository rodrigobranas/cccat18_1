import pgp from "pg-promise";

// Port
export default interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(accountId: string): Promise<any>;
  saveAccount(account: any): Promise<any>;
}

// Adapter
export class AccountDAODatabase implements AccountDAO {
   async getAccountByEmail(email: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where email = $1", [email]);
    await connection.$pool.end();
    return accountData;
  }
  
   async getAccountById(accountId: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return accountData;
  }
  
   async saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
       [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
    await connection.$pool.end();
  } 
}

export class AccountDAOMemory implements AccountDAO {
  memory: any[] = []
  async getAccountByEmail(email: string): Promise<any> {
    return this.memory.find((account: any) => account.email === email)
  }
 async getAccountById(accountId: string): Promise<any> {
  return this.memory.find((account: any) => account.accountId === accountId)
    
  }
  async saveAccount(account: any): Promise<any> {
    return this.memory.push(account)
  }

}