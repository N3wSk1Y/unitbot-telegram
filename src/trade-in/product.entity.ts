import {
    Column,
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
    description: string;

    @ManyToMany(() => LocalFile)
    @JoinTable()
    files: LocalFile[];
}
