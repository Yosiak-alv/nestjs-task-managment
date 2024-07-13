import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { TaskStatus } from "../types/task-statuses.enum";

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
}