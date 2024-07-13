import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './models/task.entity';
import { UpdateStatusTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async index(@Query() filterDto: GetTaskFilterDto) : Promise<Task[]> {
        return await this.tasksService.findAll(filterDto);
    }
    @Get(':id')
    async show( @Param('id') id: string ) : Promise<Task> {
        return await this.tasksService.findById(id);
    }
    @Post()
    async create( @Body() createTaskDto : CreateTaskDto ) : Promise<Task> {
        return await this.tasksService.create(createTaskDto);
    }
    @Patch(':id/status')
    async updateStatus( @Param('id') id: string, @Body() updateStatusTaskDto : UpdateStatusTaskDto ) : Promise<Task> {
        return await this.tasksService.updateStatus(id, updateStatusTaskDto);
    }
    @Delete(':id')
    async destroy( @Param('id') id: string ): Promise<void> {
        await this.tasksService.delete(id);
    }
}