import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    const { mimetype } = value;

    if (!mimetype.includes('image')) {
      throw new BadRequestException(
        'The image should be either jpeg, png, or webp.',
      );
    }

    return value;
  }
}
