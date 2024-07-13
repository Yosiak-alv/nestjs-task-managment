import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, ManyToOne } from "typeorm";
import { TaskStatus } from "../types/task-statuses.enum";
import { User } from "src/auth/models/user.entity";
import { Exclude } from "class-transformer";

//Other Approach Active Record Pattern
@Entity('tasks')
export class Task{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    title: string;
    
    @Column()
    description: string;
    
    @Column()
    status: TaskStatus;

    @ManyToOne((_type) => User, user => user.tasks, {eager: false}) // eager false means that when we fetch a task, we don't fetch the user associated with that task
    @Exclude({toPlainOnly: true}) // This will exclude the user when we return the task
    user: User;
}