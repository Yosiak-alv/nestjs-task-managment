import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    private tasks = [];

    findAll(): any[] {
        return this.tasks;
    }

    create(task): void{
        this.tasks.push(task);
    }
}
