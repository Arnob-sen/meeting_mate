import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({ description: 'The question to ask the AI' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Optional meeting ID to filter the search',
  })
  @IsString()
  @IsOptional()
  meetingId?: string;
}
