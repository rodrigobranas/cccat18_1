import { inject } from "./DI";
import GetAccount from "./GetAccount";
import HttpServer from "./HttpServer";
import Signup from "./Signup";

export default class AccountController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("signup")
  signup?: Signup;
  @inject("getAccount")
  getAccount?: GetAccount;


  constructor () {
    this.httpServer?.register("post","/signup", async (params: any, body: any) => {
      const input = body;
        const output = await this.signup?.execute(input);
        return output;
    });
    
    this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
      const output = await this.getAccount?.execute(params.accountId);
      return output;
    });

  }

}