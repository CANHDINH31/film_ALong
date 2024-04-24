import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class VideoTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    try {
      const { mimetype } = value;

      console.log(value);

      if (!mimetype.includes('video')) {
        await fs.unlink(value.path, (err) => {
          if (err) {
            console.log('error in deleting a file from uploads');
          } else {
            console.log('succesfully deleted from the uploads folder');
          }
        });
        throw new BadRequestException('Only upload video');
      }

      return value;
    } catch (error) {
      throw error;
    }
  }
}
