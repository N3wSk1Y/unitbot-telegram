import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LocalFile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true,
    })
    fileName: string;

    @Column()
    path: string;

    @Column()
    mimetype: string;
}
