import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import { getAccountById, signup } from "./signup";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
  const output = await signup(input)

  if(typeof output === "number") {
    res.status(422).json({ message: output });
  }else {
    res.json(output)
  } 
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountData = await getAccountById(req.params.accountId)
  res.json(accountData);
})

app.listen(3000);
