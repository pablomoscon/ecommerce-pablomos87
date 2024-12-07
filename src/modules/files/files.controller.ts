import { Controller, Post, Param, UseInterceptors, UploadedFile, ParseUUIDPipe, HttpException, HttpStatus, HttpCode, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isUUID } from 'class-validator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageAndUpdateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    try {
      if (!isUUID(id, 4)) {
        throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
      }
      const uploadedImageUrl = await this.filesService.uploadImage(id, file);
      return { url: uploadedImageUrl };
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Error while uploading the image');
    }
  };
};
