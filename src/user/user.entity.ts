import { Column, Entity, PrimaryColumn } from "typeorm";

export enum UserRole {
    User = "user",
    Manager = "manager",
}

@Entity()
export class User {
    @PrimaryColumn({
        type: "bigint",
    })
    id: number;

    @Column({
        type: "text",
        nullable: true,
    })
    username: string;

    @Column({
        type: "text",
        nullable: true,
    })
    firstName: string;

    @Column({
        type: "text",
        nullable: true,
    })
    lastName: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.User,
    })
    role: UserRole;
}
