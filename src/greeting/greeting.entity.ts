import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Greeting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromChatId: number;

    @Column()
    messageId: number;
}
