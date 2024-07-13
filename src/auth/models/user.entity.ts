import { Task } from "../../tasks/models/task.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn, OneToMany } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;

    @OneToMany((_type) => Task, task => task.user, {eager: true}) // eager true means that when we fetch a user, we also fetch the tasks associated with that user
    tasks: Task[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updatedAt: Date;
}
