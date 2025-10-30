import DashboardRepositoryInterface from "../../domain/Interfaces/DashboardRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import Connection from "../database/Connection";
import DashboardRepositoryDatabase from "./database/DashboardRepositoryDatabase";
import UserRepositoryDatabase from "./database/UserRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactoryInterface {

    readonly userRepository: UserRepositoryInterface;
    readonly dashboardRepository: DashboardRepositoryInterface

    constructor(connection: Connection) {
        this.userRepository = new UserRepositoryDatabase(connection);
        this.dashboardRepository = new DashboardRepositoryDatabase(connection);
    }

    createUserRepository(): UserRepositoryInterface { return this.userRepository; }
    createDashboardRepository(): DashboardRepositoryInterface { return this.dashboardRepository; }
}