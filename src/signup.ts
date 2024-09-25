import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";


export async function signup(input: any) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const [accountData] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (accountData) throw new Error("Duplicate account")
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
    await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		return { accountId: id };
		
	} finally {
		await connection.$pool.end();
	}
};

export async function getAccountById(accountId: any) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
  await connection.$pool.end();
  return accountData;
}

