import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserRole } from "../user/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
    public constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const userid = context.getArgs()[0].update.message.from.id;
        const user = await this.userService.getOneByTelegramId(userid);

        return user.role === UserRole.Manager;
    }
}
