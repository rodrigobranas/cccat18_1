import request from "supertest";
import { jest } from "@jest/globals";
import { app } from "../src/signup";

const mockDb = {
  query: jest.fn(),
  $pool: {
    end: jest.fn(),
  },
};

const pgp = jest.fn(() => mockDb);

jest.mock("pg-promise", () => {
  return jest.fn(() => pgp);
});

describe("POST /signup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a new user with valid input", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "34047573000",
      carPlate: "ABC1234",
      isPassenger: true,
      isDriver: false,
      password: "securePassword123",
    };
    //@ts-ignore
    mockDb.query.mockResolvedValueOnce([]);
    const response = await request(app).post("/signup").send(input);
    expect(response.body).toHaveProperty("accountId");
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.any(String)])
    );
  });

  it("should return an error for an existing user", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "34047573000",
      carPlate: "ABC1234",
      isPassenger: true,
      isDriver: false,
      password: "securePassword123",
    };
    // @ts-ignore
    mockDb.query.mockResolvedValueOnce([{ email: input.email }]);
    const response = await request(app).post("/signup").send(input);
    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-4);
  });

  it("should return an error for invalid email", async () => {
    const input = {
      name: "John Doe",
      email: "invalid-email",
      cpf: "34047573000",
      carPlate: "ABC1234",
      isPassenger: true,
      isDriver: false,
      password: "securePassword123",
    };
    //@ts-ignore
    mockDb.query.mockResolvedValueOnce([]);
    const response = await request(app).post("/signup").send(input);
    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-2);
  });

  it("should return an error for invalid CPF", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "invalid-cpf",
      carPlate: "ABC1234",
      isPassenger: true,
      isDriver: false,
      password: "securePassword123",
    };
    //@ts-ignore
    mockDb.query.mockResolvedValueOnce([]);
    const response = await request(app).post("/signup").send(input);
    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-1);
  });

  it("should return an error for invalid car plate", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "34047573000",
      carPlate: "invalid-plate",
      isPassenger: true,
      isDriver: true,
      password: "securePassword123",
    };
    //@ts-ignore
    mockDb.query.mockResolvedValueOnce([]);
    const response = await request(app).post("/signup").send(input);
    expect(response.status).toBe(422);
    expect(response.body.message).toBe(-5);
  });
});
