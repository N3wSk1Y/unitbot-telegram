import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
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

    @ManyToMany(() => LocalFile)
    @JoinTable()
    files: LocalFile[];

    @CreateDateColumn()
    date: Date;
}
