import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import User from "./interfaces/user.interface";
import pg from "pg-promise/typescript/pg-subset";

export const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const { body: input }: { body: User } = req;
  const connection = createConnection();
  try {
    const userInDb = await retrieveExistingUser(input, connection);
    const payloadError = verifyInputsAndReturnErrorIfExists(input, userInDb);
    if (payloadError) return res.status(422).send({ message: payloadError });
    const id = crypto.randomUUID();
    await registerUser(input, id, connection);
    const result = { accountId: id };
    res.json(result);
  } finally {
    await endConnection(connection);
  }
});

type Connection = pgp.IDatabase<{}, pg.IClient>;
const createConnection = (): Connection => {
  return pgp()("postgres://postgres:123456@localhost:5432/app");
};

const endConnection = async (connection: any): Promise<void> => {
  return await connection.$pool.end();
};

const verifyInputsAndReturnErrorIfExists = (
  input: User,
  acc: any
): number | undefined => {
  const ERROR_CODES = {
    ALREADY_EXISTS: -4,
    NAME_INVALID: -3,
    EMAIL_INVALID: -2,
    CPF_INVALID: -1,
    PLATE_INVALID: -5,
  };

  const isNameValid = input.name.match(/[a-zA-Z] [a-zA-Z]+/);
  const isEmailValid = input.email.match(/^(.+)@(.+)$/);
  const isPlateValid = input.carPlate?.match(/[A-Z]{3}[0-9]{4}/);

  if (acc) return ERROR_CODES.ALREADY_EXISTS;

  if (!isNameValid) return ERROR_CODES.NAME_INVALID;

  if (!isEmailValid) return ERROR_CODES.EMAIL_INVALID;

  if (!validateCpf(input.cpf)) return ERROR_CODES.CPF_INVALID;

  if (!validateCpf(input.cpf)) return ERROR_CODES.CPF_INVALID;

  if (!isPlateValid && input.isDriver) return ERROR_CODES.PLATE_INVALID;
};

const registerUser = async (
  input: User,
  id: string,
  connection: Connection
) => {
  if (input.isDriver)
    return await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
        input.password,
      ]
    );

  return await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      id,
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      !!input.isPassenger,
      !!input.isDriver,
      input.password,
    ]
  );
};

const retrieveExistingUser = async (input: User, connection: Connection) => {
  const [acc] = await connection.query(
    "select * from ccca.account where email = $1",
    [input.email]
  );
  return acc;
};

app.listen(3000);
