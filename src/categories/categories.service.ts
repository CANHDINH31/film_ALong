import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModal: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.categoryModal.create(createCategoryDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới category thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(status: string) {
    try {
      const query = { ...(status && { status: status }) };
      return await this.categoryModal.find(query);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.categoryModal.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const data = await this.categoryModal.findByIdAndUpdate(
        id,
        updateCategoryDto,
        { new: true },
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật category thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.categoryModal.findByIdAndUpdate(id, { status: 0 });
      return 'Delete Successfully';
    } catch (error) {
      throw error;
    }
  }
}
