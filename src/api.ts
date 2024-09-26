import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import { AccountDAODatabase } from "./AccountDAO";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const accountDAODatabase = new AccountDAODatabase()
    const signup = new Signup(accountDAODatabase);
    const output = await signup.execute(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  } 
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountDAODatabase = new AccountDAODatabase()
  const getAccount = new GetAccount(accountDAODatabase);
	const accountData = await getAccount.execute(req.params.accountId)
  res.json(accountData);
})

app.listen(3000);
