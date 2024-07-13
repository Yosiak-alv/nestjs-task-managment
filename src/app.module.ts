import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MatchConstraint } from './common/custom-decorators-validations/match.decorator';
import { IsUniqueConstraint } from './common/custom-decorators-validations/unique.decorator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchemaValidation } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configSchemaValidation
    }),
    /* TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true, 
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
      }),
    }), */
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
