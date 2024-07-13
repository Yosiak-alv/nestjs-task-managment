import { TaskStatus } from '../types/task-statuses.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusTaskDto {

    @IsEnum(TaskStatus)
    status: TaskStatus;
}