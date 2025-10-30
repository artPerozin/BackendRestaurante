import DashboardRepositoryInterface from "./DashboardRepositoryInterface";
import UserRepositoryInterface from "./UserRepositoryInterface";

export default interface RepositoryFactoryInterface {

    createUserRepository(): UserRepositoryInterface;
    createDashboardRepository(): DashboardRepositoryInterface;
}
