import pgp from "pg-promise"

export default interface DatabaseConnection {
  query (statment: string, params: any): Promise<any>;
  close (): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:123456@localhost:5433/app");
  }

  query(statment: string, params: any): Promise<any> {
    return this.connection?.query(statment, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
  
}