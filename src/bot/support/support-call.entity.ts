import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/user.entity";

export enum CallType {
    Support = "support",
    TradeIn = "tradeIn",
}

@Entity({
    name: "supportcalls",
})
export class SupportCall {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    client: User;

    @OneToOne(() => User)
    @JoinColumn()
    manager: User;

    @Column({
        type: "enum",
        enum: CallType,
        default: CallType.Support,
    })
    type: CallType;
}
