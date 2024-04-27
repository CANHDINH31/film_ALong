import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertismentsService } from './advertisments.service';
import { CreateAdvertismentDto } from './dto/create-advertisment.dto';
import { UpdateAdvertismentDto } from './dto/update-advertisment.dto';

@Controller('advertisments')
export class AdvertismentsController {
  constructor(private readonly advertismentsService: AdvertismentsService) {}

  @Post()
  sync(@Body() createAdvertismentDto: CreateAdvertismentDto) {
    return this.advertismentsService.sync(createAdvertismentDto);
  }

  @Get()
  findAll() {
    return this.advertismentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertismentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdvertismentDto: UpdateAdvertismentDto,
  ) {
    return this.advertismentsService.update(+id, updateAdvertismentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertismentsService.remove(+id);
  }
}
