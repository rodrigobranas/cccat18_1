import AccountRepository from "../infra/repository/accountRepository";
import { validateCpf } from "../validateCpf";

export default class CreateAccount {

    constructor(readonly accountRepository: AccountRepository) {
    }
    
    async execute(userData: any): Promise<any> {
        const account = await this.accountRepository.getAccountByEmail(userData.email)
        if (account) throw new Error('Account aready exists!');
        if (!userData.name || !userData.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name!');
        if (!userData.email || !userData.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email!');
        if (!validateCpf(userData.cpf)) throw new Error('Invalid cpf!');
        if (userData.isDriver && !userData.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate!');
        const id = crypto.randomUUID();
        userData.accountId = id;
        const accountId = await this.accountRepository.saveAccount(userData);
        return {
            accountId: accountId,
        };
    }
}