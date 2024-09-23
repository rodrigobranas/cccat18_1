import express from "express";
import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import GetAccount from "./GetAccount";
import { Registry } from "./DI";


const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();

Registry.getInstance().provide("accountRepository", accountRepository);


app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    
    const signup = new Signup();
    const output = await signup.execute(input);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({message: e.message})
  }
});

app.get("/accounts/:accountId", async function (req, res){
  const accountRepository = new AccountRepositoryDatabase();
  const getAccount = new GetAccount(accountRepository);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});


app.listen(3000);
