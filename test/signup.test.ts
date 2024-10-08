import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import MailerGatewayMemory from "../src/MailerGatewayMemory";
import Signup from "../src/Signup";
import sinon from "sinon";

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
  const accountDAODatabase = new AccountDAODatabase();
  const mailerGatewayMemory = new MailerGatewayMemory();
  // const accountDAOMemory = new AccountDAOMemory();
  signup = new Signup(accountDAODatabase, mailerGatewayMemory)
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
 // expect(outputGetAccount.isPassenger).toBe(input.isPassenger)
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

test('Deve criar a conta de um passageiro com stub', async function () {
  const mailerStup = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
  const getAccountByEmail = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();

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
  //expect(outputGetAccount.isPassenger).toBe(input.isPassenger)
  mailerStup.restore();
  getAccountByEmail.restore();
});

test('Deve criar a conta de um passageiro com spy', async function () {
  const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
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
  //expect(outputGetAccount.isPassenger).toBe(input.isPassenger)
  expect(mailerSpy.calledOnce).toBe(true)
  expect(mailerSpy.calledWith(input.email)).toBe(true)
  mailerSpy.restore();
});

test('Deve criar a conta de um passageiro com mock', async function () {
  const mailerMock = sinon.mock(MailerGatewayMemory.prototype);
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }

  mailerMock.expects("send").withArgs(input.email).once().callsFake(() => {
    console.log("teste")
  })

  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.password).toBe(input.password)
  //expect(outputGetAccount.isPassenger).toBe(input.isPassenger)
  mailerMock.verify()
  mailerMock.restore();
});