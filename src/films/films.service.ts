import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/schemas/film.schema';
import { Response } from 'express';
import { statSync, createReadStream } from 'fs';
import { User } from 'src/schemas/users.schema';
import { NORMAL_USER, VIP_USER } from 'src/constants';
import * as fs from 'fs';

@Injectable()
export class FilmsService {
  constructor(
    @InjectModel(Film.name) private filmModal: Model<Film>,
    @InjectModel(User.name) private userModal: Model<User>,
  ) {}

  async createByAdmin(createFilmDto: CreateFilmDto) {
    try {
      const data = await this.filmModal.create({
        ...createFilmDto,
        type: 1,
        status: 1,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới film thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async createByUser(createFilmDto: CreateFilmDto) {
    try {
      const user = await this.userModal.findById(createFilmDto.user);
      const userType = user.type;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const amountUploadVideoToday = await this.filmModal.countDocuments({
        user: createFilmDto.user,
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (userType === NORMAL_USER && amountUploadVideoToday === 1) {
        await fs.unlink(createFilmDto.url, (err) => {
          if (err) {
            console.log('error in deleting a file from uploads');
          } else {
            console.log('succesfully deleted from the uploads folder');
          }
        });

        throw new BadRequestException(
          'Register as a VIP member to post 2 videos per day',
        );
      }

      if (userType === VIP_USER && amountUploadVideoToday === 2) {
        await fs.unlink(createFilmDto.url, (err) => {
          if (err) {
            console.log('error in deleting a file from uploads');
          } else {
            console.log('succesfully deleted from the uploads folder');
          }
        });

        throw new BadRequestException('Only post 2 videos per day');
      }

      const data = await this.filmModal.create({
        ...createFilmDto,
        type: 2,
        status: 2,
      });

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
    const video = await this.filmModal.findById(id);
    const videoPath = video?.url;
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
    status: number,
    type: number,
    user?: string,
  ) {
    try {
      const skip = Number(pageSize) * (page - 1);
      const take = Number(limit) || Number(pageSize);

      const listCategory = category?.split(',');

      const query = {
        ...(listCategory?.length > 1 && { category: { $in: listCategory } }),
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(status && { status: Number(status) }),
        ...(type && { type: Number(type) }),
        ...(user && { user: user }),
      };

      const data = await this.filmModal
        .find(query)
        .populate('category')
        .populate('user')
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
      return await this.filmModal
        .findById(id)
        .populate('category')
        .populate('user');
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
