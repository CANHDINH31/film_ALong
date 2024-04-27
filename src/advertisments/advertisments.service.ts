import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdvertismentDto } from './dto/create-advertisment.dto';
import { UpdateAdvertismentDto } from './dto/update-advertisment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Advertisment } from 'src/schemas/advertisment.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdvertismentsService {
  constructor(
    @InjectModel(Advertisment.name)
    private advertismentModal: Model<Advertisment>,
  ) {}

  private async onModuleInit() {
    await this.initCreateAdvertisment();
  }

  async initCreateAdvertisment() {
    try {
      const existAdvertisment = await this.advertismentModal.findOne();

      if (existAdvertisment) return;

      await this.advertismentModal.create({
        video1: '',
        video2: '',
        video3: '',
        video4: '',
      });
    } catch (error) {
      throw error;
    }
  }

  async sync(createAdvertismentDto: CreateAdvertismentDto) {
    try {
      const advertisment = await this.advertismentModal.findOne({});

      const data = await this.advertismentModal.findByIdAndUpdate(
        advertisment._id,
        { ...createAdvertismentDto },
        { new: true },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Đồng bộ quảng cáo thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return this.advertismentModal.findOne({});
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} advertisment`;
  }

  update(id: number, updateAdvertismentDto: UpdateAdvertismentDto) {
    return `This action updates a #${id} advertisment`;
  }

  remove(id: number) {
    return `This action removes a #${id} advertisment`;
  }
}
