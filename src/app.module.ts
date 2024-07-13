import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MatchConstraint } from './common/custom-decorators-validations/match.decorator';
import { IsUniqueConstraint } from './common/custom-decorators-validations/unique.decorator';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // this will auto load any entities that are in the entities folder
      synchronize: true, // this will auto create tables based on the entities
    }),
    TasksModule,
    AuthModule,
    CommonModule,
  ],
  providers: [MatchConstraint, IsUniqueConstraint],
})
export class AppModule {}
