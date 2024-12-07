import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const maxSize = 204800;
        const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!value) {
            throw new BadRequestException('No file provided');
        }

        if (!value.size || value.size > maxSize) {
            throw new BadRequestException('File size exceeds the limit of 200 KB');
        }

        if (!value.mimetype || !mimeTypes.includes(value.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types are: ${mimeTypes.join(', ')}`,
            );
        }
        return value;
    }
};