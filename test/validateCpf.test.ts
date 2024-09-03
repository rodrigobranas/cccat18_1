import { validateCpf } from "../src/validateCpf";

test("Deve validar um cpf com o digito diferente de zero", function () {
	const cpf = "97456321558";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(true);
});

test("Deve validar um cpf com o segundo digito zero", function () {
	const cpf = "71428793860";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(true);
});

test("Deve validar um cpf com o primeiro digito zero", function () {
	const cpf = "87748248800";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(true);
});

test("Não deve validar um cpf com menos de 11 caracteres", function () {
	const cpf = "9745632155";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(false);
});

test("Não deve validar um cpf com todos os caracteres iguais", function () {
	const cpf = "11111111111";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(false);
});

test("Não deve validar um cpf com letras", function () {
	const cpf = "97a56321558";
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(false);
});
