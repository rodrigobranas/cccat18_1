import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import { getAccountById, signup } from "./signup";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const input = req.body;
    const output = await signup(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  } 
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountData = await getAccountById(req.params.accountId)
  res.json(accountData);
})

app.listen(3000);
