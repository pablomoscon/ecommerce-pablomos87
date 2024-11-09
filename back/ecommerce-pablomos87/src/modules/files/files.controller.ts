import { Controller,  Post,  Param, UseInterceptors, UploadedFile, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isUUID } from 'class-validator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageAndUpdateProduct(
    @Param('id',new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File, 
  ) {
    if (!isUUID(id, 4)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const uploadResult = await this.filesService.uploadImage(file);
    console.log(uploadResult);
    
    await this.filesService.updateProductWithImageUrl(id, uploadResult.secure_url);
    return { message: 'Image uploaded and entity updated successfully'};
}
}
