import { AccountRepositoryDatabase } from "../src/infra/repository/accountRepository";
import CreateAccount from "../src/services/createAccount";
import GetAccount from "../src/services/getAccount";
import pgp from "pg-promise";

let createAccount: CreateAccount;
let getAccount: GetAccount;
let newAccount: any;

beforeEach(() => {
    const repository = new AccountRepositoryDatabase();
    createAccount = new CreateAccount(repository);
    getAccount = new GetAccount(repository);
    newAccount = {
        name: 'Jhon Doe',
        email: 'jhonDoe@email.com',
        cpf: '72379972036',
        carPlate: 'ABC1234',
        password: '12345',
        isDriver: true,
    };
});

afterEach(async () => {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
        "delete from ccca.account where email = 'jhonDoe@email.com'"
    );
    await connection.$pool.end();
});


test('Should register a valid driver', async () => {
    const accountId = await createAccount.execute(newAccount);
    expect(accountId).not.toBeNull();
    const userAccount = await getAccount.getById(accountId);
    expect(userAccount.accountId).toBeDefined();
    expect(userAccount.name).toBe('Jhon Doe');
    expect(userAccount.email).toBe('jhonDoe@email.com');
    expect(userAccount.cpf).toBe('72379972036');
    expect(userAccount.carPlate).toBe('ABC1234');
    expect(userAccount.password).toBe('12345');
    expect(userAccount.isDriver).toBe(true);
});

test('Should register a valid passenger', async () => {
    newAccount.isPassenger = true;
    newAccount.isDriver = false;
    const accountId = await createAccount.execute(newAccount);
    
    expect(accountId).toBeDefined()
});

test('Should not register user with exists email', async () => {
    await createAccount.execute(newAccount);

    await expect(() => createAccount.execute(newAccount)).rejects.toThrow('Account aready exists!');
});

test('Should not register a user when invalid name', async () => {
    newAccount.name = 'Jhon';
    await expect(() => createAccount.execute(newAccount)).rejects.toThrow('Invalid name!');
});

test('Should not register a user when invalid email', async () => {
    newAccount.email = 'jhonDoe';

    await expect(() => createAccount.execute(newAccount)).rejects.toThrow('Invalid email!');
});

test('Should not register a user when invalid cpf', async () => {
    newAccount.cpf = '12345678911';
    await expect(() => createAccount.execute(newAccount)).rejects.toThrow('Invalid cpf!');
});

test('Should not register a driver when carplate is invalid', async () => {
    newAccount.carPlate = 'ORL1K23';
    await expect(() => createAccount.execute(newAccount)).rejects.toThrow('Invalid car plate!');
});