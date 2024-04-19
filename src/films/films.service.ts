import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/schemas/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModal: Model<Film>) {}

  async create(createFilmDto: CreateFilmDto) {
    try {
      const data = await this.filmModal.create(createFilmDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới film thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async list(
    page = 1,
    pageSize = 10,
    title = '',
    limit: number,
    category: string,
  ) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = Number(limit) || Number(pageSize);

      const query = {
        ...(category && { category: category }),
        ...(title && { title: { $regex: title, $options: 'i' } }),
      };

      const data = await this.filmModal
        .find(query)
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take);

      const totalItems = await this.filmModal.find(query).count();

      const totalPage = Math.ceil(totalItems / Number(pageSize));

      return {
        currentPage: Number(page),
        totalPage,
        itemsPerPage: Number(take),
        totalItems,
        data,
      };
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      return await this.filmModal.findById(id).populate('category');
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    try {
      const data = await this.filmModal.findByIdAndUpdate(id, updateFilmDto, {
        new: true,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật film thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.filmModal.findByIdAndDelete(id);
      return 'Delete successfully';
    } catch (error) {
      throw error;
    }
  }
}
