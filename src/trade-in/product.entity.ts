import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { LocalFile } from "../local-file/local-file.entity";

@Entity({
    name: "products",
})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "text",
    })
    title: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description: string;

    @Column({
        default: 0,
    })
    category: number;

    @ManyToMany(() => LocalFile)
    @JoinTable()
    files: LocalFile[];

    @CreateDateColumn()
    date: Date;
}
