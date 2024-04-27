import { PartialType } from '@nestjs/swagger';
import { CreateAdvertismentDto } from './create-advertisment.dto';

export class UpdateAdvertismentDto extends PartialType(CreateAdvertismentDto) {}
