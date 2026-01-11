import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeetingsService } from './meetings.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { ChatDto } from './dto/chat.dto';

@ApiTags('Meetings') // Groups endpoints in Scalar
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload audio and generate AI summary' })
  @ApiConsumes('multipart/form-data') // Tells Swagger this is a file upload
  @ApiBody({
    description: 'Client meeting audio and metadata',
    type: CreateMeetingDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createMeeting(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMeetingDto, // Use DTO here
  ) {
    return this.meetingsService.create(file, body.clientName);
  }

  @Get()
  @ApiOperation({ summary: 'Get all past meeting summaries' })
  async getMeetings() {
    return this.meetingsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Semantic search across meetings' })
  async search(@Query('q') q: string) {
    if (!q) return [];
    return this.meetingsService.search(q);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with your meeting data (RAG)' })
  async chat(@Body() chatDto: ChatDto) {
    return this.meetingsService.chat(chatDto.query, chatDto.meetingId);
  }

  @Get('chat/history')
  @ApiOperation({ summary: 'Get paginated chat history' })
  async getChatHistory(
    @Query('limit') limit?: number,
    @Query('before') before?: string,
    @Query('meetingId') meetingId?: string,
  ) {
    return this.meetingsService.getChatHistory(
      limit ? Number(limit) : 20,
      before,
      meetingId,
    );
  }
}
