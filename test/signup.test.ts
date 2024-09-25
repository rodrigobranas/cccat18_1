import axios from 'axios';

axios.defaults.validateStatus = () => {
  return true; // caso chego algum exception ele retorna true
}

test('Deve criar a conta de um passageiro', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  const outputSignup = responseSignup.data;

  expect(outputSignup.accountId).toBeDefined();

  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
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
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe(-3)
});

test('Nao deve criar a conta de um passageiro com email inválido', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe(-2)
});

test('Nao deve criar a conta de um passageiro com cpf inválido', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '8251970709',
    password: '123456',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe(-1)
});

test('Nao deve criar a conta de um passageiro duplicado', async function () {
  const input = {
    name: 'Bruce Wayne',
    email: `bruce.wayne${Math.random()}@branas.com.br`,
    cpf: '82519707097',
    password: '123456',
    isPassenger: true,
  }
  await axios.post('http://localhost:3000/signup', input);
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe(-4)
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
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe(-5)
});