import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

const accountDAO = new AccountDAO()

export async function signup(input: any) {
  input.id = crypto.randomUUID();
  const accountData = await accountDAO.getAccountByEmail(input.email);
  if (accountData) throw new Error("Duplicated account")
  if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
  if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
  if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
  if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
  await accountDAO.saveAccount(input)
  return { accountId: input.id };
};

export async function getAccount(accountId: any) {
  const accountData = await accountDAO.getAccountById(accountId)
  return accountData;
}

