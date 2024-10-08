import crypto from "crypto";
import { AccountRepository} from "./AccountRepository";
import MailerGateway from "./MailerGateway";
import { Account } from "./Account";

export default class Signup {

	constructor (readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {
	}

	async execute (input: any) {
		const accountData = await this.accountRepository.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		const account = Account.create(
			input.name,
			input.email,
			input.cpf,
			input.carPlate,
			input.password,
			input.isPassenger,
			input.isDriver
		)
		await this.accountRepository.saveAccount(account);
		await this.mailerGateway.send(account.getEmail(), "Welcome!", "...");
		return {
			accountId: account.getAccountId(),
		};
	}
}
