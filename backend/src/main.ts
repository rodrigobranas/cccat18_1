import { Registry } from "./infra/DI/DI";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/Repository/AccountRepository";
import Signup from "./application/usecases/Signup";
import GetAccount from "./application/usecases/GetAccount";


const httpServer = new ExpressAdapter();

Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Registry.getInstance().provide("signup", new Signup());
Registry.getInstance().provide("getAccount", new GetAccount());
Registry.getInstance().provide("accountController", new AccountController());

httpServer.listen(3000);
