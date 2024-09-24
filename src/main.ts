import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import GetAccount from "./GetAccount";
import { Registry } from "./DI";
import { PgPromiseAdapter } from "./DataBaseConnection";
import { ExpressAdapter } from "./HttpServer";
import AccountController from "./AccountController";


const httpServer = new ExpressAdapter();

Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Registry.getInstance().provide("signup", new Signup());
Registry.getInstance().provide("getAccount", new GetAccount());
Registry.getInstance().provide("accountController", new AccountController());

httpServer.listen(3000);
