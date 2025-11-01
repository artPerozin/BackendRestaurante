import { config } from "dotenv";

import PostgreSQLConnection from "./infra/database/PostgreSQLConnection";
import ExpressHttp from "./infra/http/ExpressHttp";
import Router from "./infra/http/Router";
import DatabaseRepositoryFactory from "./infra/repository/DatabaseRepositoryFactory";
import ExpressAuth from "./infra/http/Middleware/AuthExpress";

config();

async function bootstrap() {
    const connection = new PostgreSQLConnection({
        user: process.env.DB_USERNAME ?? '',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_DATABASE ?? '',
        host: process.env.DB_HOST ?? '',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
    });

    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    const auth = new ExpressAuth(repositoryFactory);
    const http = new ExpressHttp(auth);
    const router = new Router(http, repositoryFactory);

    const port = 8000;

    router.init();
    http.listen(port);
    console.log(`Running on ${port}`);
}

bootstrap();