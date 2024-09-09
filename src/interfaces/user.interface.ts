export default interface User {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver: boolean;
  password?: string;
}
