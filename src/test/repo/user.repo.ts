import { NeDBRepository } from "../../lib/provider/nedb/service/nedb-repository.service";
import { User } from "../model/user.model";

export class UserRepo extends NeDBRepository<User> {
    databaseName(): string {
        return "user";
    }
    
}