import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { Task } from "./models/task.entity";
import { TasksService } from "./tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./types/task-statuses.enum";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/models/user.entity";
import { UpdateStatusTaskDto } from "./dto/update-task.dto";
import { CreateTaskDto } from "./dto/create-task.dto";


const mockTaskRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
    }),
});

const mockUser: User = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    tasks: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('TasksService', () => {
    let tasksService: TasksService;
    let taskRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getRepositoryToken(Task), useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    });

    describe('findAll', () => {
        it('calls taskRepository.createQueryBuilder and returns the result', async () => {
            const mockTasks = [new Task(), new Task()];
            taskRepository.createQueryBuilder().getMany.mockResolvedValue(mockTasks);

            const filterDto: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Test' };

            const result = await tasksService.findAll(filterDto, mockUser);
            expect(result).toEqual(mockTasks);
        });

        it('calls taskRepository.createQueryBuilder and handles an error', async () => {
            taskRepository.createQueryBuilder().getMany.mockRejectedValue(new Error('Some error'));

            const filterDto: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Test' };

            await expect(tasksService.findAll(filterDto, mockUser)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findById', () => {
        it('calls taskRepository.findOne and returns the result', async () => {
            const mockTask = new Task();
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.findById('task-id', mockUser);
            expect(result).toEqual(mockTask);
        });

        it('calls taskRepository.findOne and handles an error', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            await expect(tasksService.findById('task-id', mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('calls taskRepository.create and taskRepository.save and returns the result', async () => {
            const createTaskDto: CreateTaskDto = { title: 'Test task', description: 'Test desc' };
            const mockTask = new Task();
            taskRepository.create.mockReturnValue(mockTask);
            taskRepository.save.mockResolvedValue(mockTask);

            const result = await tasksService.create(createTaskDto, mockUser);
            expect(result).toEqual(mockTask);
        });
    });

    describe('updateStatus', () => {
        it('calls taskRepository.findOne and taskRepository.save and returns the result', async () => {
            const mockTask = new Task();
            taskRepository.findOne.mockResolvedValue(mockTask);

            const updateStatusTaskDto: UpdateStatusTaskDto = { status: TaskStatus.DONE };
            mockTask.status = updateStatusTaskDto.status; // Manually update the mock task's status

            taskRepository.save.mockResolvedValue(mockTask);

            const result = await tasksService.updateStatus('task-id', updateStatusTaskDto, mockUser);
            expect(result).toEqual(mockTask);
        });
    });

    describe('delete', () => {
        it('calls taskRepository.delete and returns void', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });

            await tasksService.delete('task-id', mockUser);

            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 'task-id', user: { id: mockUser.id } });
        });

        it('calls taskRepository.delete and handles an error', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });

            await expect(tasksService.delete('task-id', mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});