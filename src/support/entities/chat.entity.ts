import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "../../user/user.entity";

@Entity({
    name: "chats",
})
export class Chat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    target: User;

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}
