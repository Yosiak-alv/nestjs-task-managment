
import { TaskStatus } from "../types/task-statuses.enum";
import { IsEnum, IsString, IsOptional } from "class-validator";

export class GetTaskFilterDto {
    
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @IsString()
    search: string;

    //status?: TaskStatus; // ? means optional
}