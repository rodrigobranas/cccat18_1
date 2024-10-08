import { AccountRepository } from "./AccountRepository";

export default class GetAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}

	async execute (accountId: string) {
		const account = await this.accountRepository.getAccountById(accountId);
		return {
			accountId: account?.getAccountId(),
			name: account?.getName(),
			email: account?.getEmail(),
			cpf: account?.getCpf(),
			carPlate: account?.getCarPlate(),
			password: account?.getPassword(),
			isPassenger: account?.isPassenger,
			isDriver: account?.isDriver,
		};
	}
}
