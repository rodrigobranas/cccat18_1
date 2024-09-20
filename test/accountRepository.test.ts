import AccountRepository, { AccountRepositoryInMemory } from "../src/infra/repository/accountRepository";

let accountRepository: AccountRepository;
let account: any;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    account = {
        name: 'Bruno Gimenez',
        email: 'bruno@email.com',
        cpf: '72379972036',
        carPlate: 'ABC1234',
        password: '12345',
        isPassenger: false,
        isDriver: true
    };
})

test('Should save a driver', async () => {
    const accountId = await accountRepository.saveAccount(account);
    expect(accountId).not.toBeNull();
    const accountSaved = await accountRepository.getAccountById(accountId);
    expect(accountSaved.name).toBe(account.name);
    expect(accountSaved.email).toBe(account.email);
    expect(accountSaved.cpf).toBe(account.cpf);
    expect(accountSaved.carPlate).toBe(account.carPlate);
    expect(accountSaved.password).toBe(account.password);
    expect(accountSaved.isDriver).toBeTruthy();
    expect(accountSaved.isPassenger).toBeFalsy();

});

test('Should get a account by email', async () => {
    await accountRepository.saveAccount(account);
    const accountSaved = await accountRepository.getAccountByEmail(account.email);
    expect(accountSaved.name).toBe(account.name);
    expect(accountSaved.email).toBe(account.email);
    expect(accountSaved.cpf).toBe(account.cpf);
    expect(accountSaved.carPlate).toBe(account.carPlate);
    expect(accountSaved.password).toBe(account.password);
    expect(accountSaved.isDriver).toBeTruthy();
    expect(accountSaved.isPassenger).toBeFalsy();
});