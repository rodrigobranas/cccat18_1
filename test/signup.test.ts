
import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
}

test ("Deve criar a conta de um passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test ("Não deve criar a conta de um passageiro com nome inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe(-3);
});

test ("Não deve criar a conta de um passageiro com email inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe(-2);
});

test ("Não deve criar a conta de um passageiro com cpf inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "9745632155",
    password: "123456",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe(-1);
});

test ("Não deve criar a conta de um passageiro duplicado", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  await axios.post("http://localhost:3000/signup", input);
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe(-4);
});

test ("Não deve criar a conta de um motorista com placa inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA999",
    isDriver: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe(-5);
});
