import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "../../user/user.entity";

@Entity({
    name: "chats",
})
export class Chat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User)
    target: User;

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}
