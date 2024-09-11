import crypto from "crypto";
import pgp from "pg-promise";
import express, { Request } from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());
let error = 'Email já cadastrado';

app.get("/users/:id", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5433/app");
	const id = req.params.id as string;
	
	try {
		const [acc] = await connection.query("select * from ccca.account where account_id = $1", [id]);
		if (!acc) return res.status(422).json({ message: "User Not Found" });
		res.json(acc);
	} finally {
		await connection.$pool.end();
	}

});

app.post("/signup", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5433/app");
	try {
		const [acc] = await connection.query("select * from ccca.account where email = $1", [req.body.email]);
		
		if (acc || !validateData(req)) {
			return res.status(422).json({ message: error });
		} else {
			const id = crypto.randomUUID();
			const input = req.body;
			await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.car_plate, !!input.is_passenger, !!input.is_driver, input.password]);
			const obj = {
				accountId: id
			};
			res.json(obj);
		}
	} finally {
		await connection.$pool.end();
	}
});

function validateData(data: Request ): boolean {
	if (!validateName(data.body.name)) {
		error = 'Nome Inválido';
		return false;
	}
	if (!validateEmail(data.body.email)) {
		error = 'Email Inválido';
		return false;
	}
	if (!validateCpf(data.body.cpf)) { 
		error = 'CPF Inválido';
		return false;
	}
	if (!validatePlate(data.body.car_plate)) {
		error = 'Placa Inválida';
		return false;
	}
	return true;
}

function validateName(name: string) {
	const result = name.match(/[a-zA-Z] [a-zA-Z]+/);
	return !!result;
}
function validateEmail(email: string){
	return !!email.match(/^(.+)@(.+)$/);
}
function validatePlate(carPlate: string){
	return !!carPlate.match(/[A-Z]{3}[0-9]{4}/);
}


if (require.main === module) {
	app.listen(3000, () => {
		console.log('Servidor rodando na porta 3000');
	});
}

export default app;