import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name: string | null;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] })
  role: string;

  @ApiProperty()
  isSuperAdmin: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
