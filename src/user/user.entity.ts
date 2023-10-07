import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
