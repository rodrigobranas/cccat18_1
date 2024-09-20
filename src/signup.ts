import express from "express";
import { AccountRepositoryDatabase } from "./infra/repository/accountRepository";
import CreateAccount from "./services/createAccount";
import GetAccount from "./services/getAccount";


const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	try {
		const repository = new AccountRepositoryDatabase();
		const createAccount = new CreateAccount(repository);
		const accountData = req.body;
		const accountId = await createAccount.execute(accountData);
		res.json(accountId);
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	}
});

app.get('/accounts/:accountId', async function (req, res) {
	const accountRepository = new AccountRepositoryDatabase();
	const getAccoount = new GetAccount(accountRepository);
	const account = await getAccoount.execute(req.params.accountId);
	res.json(account);
})

app.listen(3000);
