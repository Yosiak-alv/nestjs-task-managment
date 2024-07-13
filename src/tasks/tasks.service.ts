import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './models/task.entity';
import { TaskStatus } from './types/task-statuses.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {}


    async findAll(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search ', 
                {search: `%${search.toLocaleLowerCase()}%`});
        }
        return await query.getMany();
    }

    async findById(id: string): Promise<Task> {
        const task = await this.taskRepository.findOneBy({id});
        if(!task) throw new NotFoundException(`Task with id ${id} not found`);
        return task;
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepository.create({...createTaskDto, status: TaskStatus.OPEN});
        return await this.taskRepository.save(task);
    }

    async updateStatus(id: string, updateStatusTaskDto: UpdateStatusTaskDto): Promise<Task> {
        const task = await this.findById(id);
        task.status = updateStatusTaskDto.status;
        return await this.taskRepository.save(task);
    }

    async delete(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Task with id ${id} not found`);
        /* const task = await this.findById(id);
        await this.taskRepository.remove(task); remove expect a object */
    }
}