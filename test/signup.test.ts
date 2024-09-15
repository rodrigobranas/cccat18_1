import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import { MailerGatewayMemory } from "../src/MailerGateway";
import Signup from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

// Integration Narrow -> Broad
beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	// fake
	// const accountDAO = new AccountDAOMemory();
	// fake
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
});

test("Deve criar a conta de um passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	// expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Não deve criar a conta de um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar a conta de um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar a conta de um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "9745632155",
		password: "123456",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar a conta de um passageiro duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});

test("Não deve criar a conta de um motorista com placa inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		carPlate: "AAA999",
		isDriver: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Deve criar a conta de um passageiro com stub", async function () {
	const mailerStub = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
	const getAccountByEmail = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();
	const input = {
		name: "John Doe",
		email: `john.doe@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	mailerStub.restore();
	getAccountByEmail.restore();
});

test("Deve criar a conta de um passageiro com spy", async function () {
	const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	expect(mailerSpy.calledOnce).toBe(true);
	expect(mailerSpy.calledWith(input.email, "Welcome!", "...")).toBe(true);
	mailerSpy.restore();
});

test("Deve criar a conta de um passageiro com mock", async function () {
	const mailerMock = sinon.mock(MailerGatewayMemory.prototype);
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	mailerMock.expects("send").withArgs(input.email, "Welcome!", "...").once().callsFake(() => {
		console.log("abc");
	});
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	mailerMock.verify();
	mailerMock.restore();
});
