import { Account } from "../../domain/account";
import pgp from "pg-promise";

export default interface AccountRepository {
    saveAccount(account: any): Promise<any>;
    getAccountById(accountId: string): Promise<any>;
    getAccountByEmail(email: string): Promise<any>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    async saveAccount(account: Account) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query(
            `insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) 
             values ($1, $2, $3, $4, $5, $6, $7, $8)`, 
            [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
        await connection.$pool.end();
        return account.accountId;
    }
    
    async getAccountByEmail(email: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from ccca.account where email = $1", [email]);
        await connection.$pool.end();
        if (account){
            return {
                accountId: account.account_id,
                name: account.name,
                email: account.email,
                cpf: account.cpf,
                carPlate: account.car_plate,
                password: account.password,
                isPassenger: account.is_passenger,
                isDriver: account.is_driver,
            };
        }
        return null;
    }

    async getAccountById(accountId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        await connection.$pool.end();
        return {
            accountId: account.account_id,
            name: account.name,
            email: account.email,
            cpf: account.cpf,
            carPlate: account.car_plate,
            password: account.password,
            isPassenger: account.is_passenger,
            isDriver: account.is_driver,
        };
    }
}

export class AccountRepositoryInMemory implements AccountRepository {

    accounts: any[];

    constructor() {
        this.accounts = [];
    }

    async saveAccount(account: Account) {
        const id = crypto.randomUUID();
        account.accountId = id;
        this.accounts.push(account);
        return id;
    }
    
    async getAccountByEmail(email: string) {
        return this.accounts.find((account: Account) => account.email === email);
    }

    async getAccountById(accountId: string) {
        return this.accounts.find((account: Account) => account.accountId === accountId);
    }
}