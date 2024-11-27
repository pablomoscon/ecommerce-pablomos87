import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // Importa la librería uuid

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  const mockFilesService = {
    uploadImage: async (id: string, file: Express.Multer.File) => {
      return { id, fileName: file.originalname }; // Simula un resultado exitoso
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImageAndUpdateProduct', () => {
    it('should upload an image successfully', async () => {
      const id = uuidv4(); // Genera un UUID válido dinámicamente
      const file: Express.Multer.File = {
        originalname: 'test-image.jpg',
        buffer: Buffer.from('test content'),
        fieldname: 'image',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const result = await controller.uploadImageAndUpdateProduct(id, file);

      expect(result).toEqual({
        id,
        fileName: file.originalname,
      });
    });

    it('should throw an error if UUID is invalid', async () => {
      const invalidId = '12345'; // UUID inválido
      const file: Express.Multer.File = {
        originalname: 'test-image.jpg',
        buffer: Buffer.from('test content'),
        fieldname: 'image',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      await expect(
        controller.uploadImageAndUpdateProduct(invalidId, file),
      ).rejects.toThrow(new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST));
    });
  });
});