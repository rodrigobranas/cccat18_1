import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test('Should register a valid driver', async () => {
    const account = {
        name: 'John Doe',
        email: 'johnDoe@email.com',
        cpf: '72379972036',
        carPlate: 'ABC1234',
        password: '12345',
        isDriver: true,
    };

    const output = await axios.post('http://localhost:3000/signup', account)
    expect(output.data.accountId).toBeDefined();
    const responseAccount = await axios.get(`http://localhost:3000/accounts/${output.data.accountId}`);
    const accountData = responseAccount.data;
    expect(accountData.name).toBe(account.name);
    expect(accountData.email).toBe(account.email);
    expect(accountData.cpf).toBe(account.cpf);
    expect(accountData.carPlate).toBe(account.carPlate);
    expect(accountData.isDriver).toBe(account.isDriver);
    
});

test('Should not register a user when invalid name', async () => {
    const account = {
        name: 'John',
        email: 'john.doe@email.com',
        cpf: '72379972036',
        carPlate: 'ABC1234',
        password: '12345',
        isPassenger: true,
    };

    const output = await axios.post('http://localhost:3000/signup', account)
    expect(output.status).toBe(422);
    expect(output.data.message).toBe('Invalid name!');
});