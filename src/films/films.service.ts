import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/schemas/film.schema';
import { Response } from 'express';
import { statSync, createReadStream } from 'fs';

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

  async stream(id: string, headers, res: Response) {
    const videoPath = `storage/video.mp4`;
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
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
