import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum VoteDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class VoteSubmissionDto {
  @ApiProperty({ enum: VoteDirection, description: 'Dirección del voto: UP o DOWN' })
  @IsEnum(VoteDirection)
  value!: VoteDirection;
}

