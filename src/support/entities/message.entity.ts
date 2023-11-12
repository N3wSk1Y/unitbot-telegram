import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/user.entity";
import { Chat } from "./chat.entity";
import { LocalFile } from "../../local-file/local-file.entity";

@Entity({
    name: "messages",
})
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;

    @ManyToOne(() => User)
    author: User;

    @Column({
        type: "text",
        nullable: true,
    })
    text: string;

    @ManyToOne(() => LocalFile)
    files: LocalFile[];

    @CreateDateColumn()
    date: Date;
}
