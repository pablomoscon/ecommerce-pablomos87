import { Controller,  Post,  Param, UseInterceptors, UploadedFile, ParseUUIDPipe, HttpException, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isUUID } from 'class-validator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageAndUpdateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File, 
  ) {
    if (!isUUID(id, 4)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
  return await this.filesService.uploadImage(id, file);
}
};
