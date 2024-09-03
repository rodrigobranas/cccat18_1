import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		let result;
		const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (!acc) {

			if (input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
				if (input.email.match(/^(.+)@(.+)$/)) {

					if (validateCpf(input.cpf)) {
						if (input.isDriver) {
							if (input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
								await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
								
								const obj = {
									accountId: id
								};
								result = obj;
							} else {
								// invalid car plate
								result = -5;
							}
						} else {
							await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);

							const obj = {
								accountId: id
							};
							result = obj;
						}
					} else {
						// invalid cpf
						result = -1;
					}
				} else {
					// invalid email
					result = -2;
				}

			} else {
				// invalid name
				result = -3;
			}

		} else {
			// already exists
			result = -4;
		}
		if (typeof result === "number") {
			res.status(422).json({ message: result });
		} else {
			res.json(result);
		}
	} finally {
		await connection.$pool.end();
	}
});

app.listen(3000);
