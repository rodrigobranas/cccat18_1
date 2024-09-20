
import { getAccount, signup } from "../src/signup";

test ("Deve criar a conta de um passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const outputSignup = await signup(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount(outputSignup.accountId);
  
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
  /*
      Aqui para não quebrar a execução quando ocorrer erro, 
    colocamos como uma função a execução do signup, assim javascript entende que a execução ocorrerá
    dentro de um try/catch por conta do toThrow
  */
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test ("Não deve criar a conta de um passageiro com email inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test ("Não deve criar a conta de um passageiro com cpf inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "9745632155",
    password: "123456",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test ("Não deve criar a conta de um passageiro duplicado", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  await signup(input);
  await expect(() => signup(input)).rejects.toThrow(new Error("Duplicated account"));
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
  await expect(() => signup(input)).rejects.toThrow(new Error("Invalid Car Plate"));
});
