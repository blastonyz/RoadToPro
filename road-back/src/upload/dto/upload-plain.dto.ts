import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadPlainDto {
  @ApiProperty({
    description: 'Datos a subir (string o objeto JSON)',
    example: { key: 'value', config: { theme: 'dark' } },
    oneOf: [
      { type: 'string', example: 'Hello World\nThis is plain text' },
      { type: 'object', example: { key: 'value', nested: { prop: 'value' } } },
    ],
  })
  @IsNotEmpty()
  data: string | object;

  @ApiProperty({
    description: 'Nombre del archivo',
    example: 'config.json',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Descripción del archivo',
    example: 'Application configuration',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
