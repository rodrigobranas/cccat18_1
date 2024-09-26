import { AccountDAODatabase } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
  const accountDAODatabase = new AccountDAODatabase();
  signup = new Signup(accountDAODatabase)
  getAccount = new GetAccount(accountDAODatabase)
})

test('Deve criar a conta de um passageiro', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger)
});

test('Nao deve criar a conta de um passageiro com nome inválido', async function () {
  const input = {
    name: 'Bruce ',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test('Nao deve criar a conta de um passageiro com email inválido', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test('Nao deve criar a conta de um passageiro com cpf inválido', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '8251970709',
    password: '123456',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test('Nao deve criar a conta de um passageiro duplicado', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});

test('Nao deve criar a conta de um motorista com placa inválido', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isDriver: true,
    carPlate: 'AAA999'
  }  
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});