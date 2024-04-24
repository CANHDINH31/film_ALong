import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageTypeValidationPipe } from 'src/pipes/image-type-validation.pipe';
import { VideoTypeValidationPipe } from 'src/pipes/video-type-validation.pipe';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          const filename = Date.now() + '-' + file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadImage(
    @UploadedFile(new ImageTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    return file.path;
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          const filename = Date.now() + '-' + file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadVideo(
    @UploadedFile(new VideoTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    return file.path;
  }
}
