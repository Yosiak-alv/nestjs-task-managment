import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './models/task.entity';
import { UpdateStatusTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { User } from '../auth/models/user.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('tasks')
@UseGuards(AuthGuard()) // This will protect all the routes in this controller
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async index(@Query() filterDto: GetTaskFilterDto, @GetUser() authUser: User) : Promise<ApiResponse> {
        return {
            data: await this.tasksService.findAll(filterDto, authUser),
        };
    }
    @Get(':id')
    async show( @Param('id') id: string, @GetUser() authUser: User ) : Promise<ApiResponse> {
        return {
            data: await this.tasksService.findById(id, authUser),
        }
    }
    @Post()
    async create( @Body() createTaskDto : CreateTaskDto , @GetUser() authUser: User) : Promise<ApiResponse> {
        return {
            data: await this.tasksService.create(createTaskDto, authUser),
            message: 'Task created successfully',
            statusCode: 201
        }
    }
    @Patch(':id/status')
    async updateStatus( @Param('id') id: string, @Body() updateStatusTaskDto : UpdateStatusTaskDto,
        @GetUser() authUser: User ) : Promise<ApiResponse> {
        return {
            data: await this.tasksService.updateStatus(id, updateStatusTaskDto, authUser),
            message: 'Task status updated successfully',
            statusCode: 200
        }
    }
    @Delete(':id')
    async destroy( @Param('id') id: string, @GetUser() authUser: User ): Promise<ApiResponse> {
        await this.tasksService.delete(id, authUser);
        return {
            message: 'Task deleted successfully',
            statusCode: 200
        } 
    }
}