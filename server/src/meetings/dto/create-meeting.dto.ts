import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({
    description: 'Name of the client',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    description: 'Audio recording file (webm, mp3, etc)',
    type: 'string',
    format: 'binary',
  })
  file: any;
}
