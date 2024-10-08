import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";
import MailerGatewayMemory from "./MailerGatewayMemory";

export default class Signup {
  constructor (readonly accountDAO: AccountDAO, readonly mailerGatewayMemory: MailerGatewayMemory) {}

  async execute (input: any) {
    input.accountId = crypto.randomUUID();
    const accountData = await this.accountDAO.getAccountByEmail(input.email);
    if (accountData) throw new Error("Duplicated account")
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
    await this.accountDAO.saveAccount(input)
    this.mailerGatewayMemory.send(input.email)
    return { accountId: input.accountId };
  };
}
