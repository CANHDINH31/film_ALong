import { Module } from '@nestjs/common';
import { AdvertismentsService } from './advertisments.service';
import { AdvertismentsController } from './advertisments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Advertisment,
  AdvertismentSchema,
} from 'src/schemas/advertisment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Advertisment.name, schema: AdvertismentSchema },
    ]),
  ],
  controllers: [AdvertismentsController],
  providers: [AdvertismentsService],
})
export class AdvertismentsModule {}
