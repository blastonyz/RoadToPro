import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service.js';
import { ChallengeModule } from '../challenge/challenge.module.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), ChallengeModule, NotificationModule],
  providers: [TasksService],
})
export class TasksModule { }
