import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
    name: "entities",
})
export class Promotion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromChatId: number;

    @Column()
    messageId: number;

    @CreateDateColumn()
    createdAt: Date;
}
