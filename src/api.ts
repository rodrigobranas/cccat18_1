import express from "express";
import { getAccount, signup } from "./signup";


const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const input = req.body;
  try { 
    const output = await signup(input);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({message: e.message})
  }
});

app.get("/accounts/:accountId", async function (req, res){
  const output = await getAccount(req.params.accountId);
  res.json(output);
});


app.listen(3000);
