import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { FindUserByEmailAndUsernameDto } from './dto/find-user-by-email-and-username.dto';
import { PasswordDto } from './dto/password-dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly configSerive: ConfigService,
  ) {}

  private async onModuleInit() {
    await this.initCreateAdmin();
  }

  async initCreateAdmin() {
    try {
      const existAdmin = await this.userModal.findOne({
        username: this.configSerive.get('NAME'),
      });

      if (existAdmin) return;
      const password = await bcrypt.hash(
        this.configSerive.get('PASSWORD'),
        Number(this.configSerive.get('SALT')),
      );

      await this.userModal.create({
        email: this.configSerive.get('EMAIL'),
        name: this.configSerive.get('NAME'),
        username: this.configSerive.get('USERNAME'),
        password: password,
        role: this.configSerive.get('ROLE'),
      });
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existUser = await this.userModal.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existUser)
        throw new BadRequestException({
          message: 'Username hoặc email đã tồn tại',
        });

      const userCreated = await this.userModal.create(createUserDto);
      const { password, ...data } = userCreated.toObject();

      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới user thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndUsername(
    findUserByEmailAndUsernameDto: FindUserByEmailAndUsernameDto,
  ) {
    try {
      const user = await this.userModal.find({
        $or: [
          { email: findUserByEmailAndUsernameDto.email },
          { username: findUserByEmailAndUsernameDto.username },
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModal.findOne({ username });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(status: number, role: number) {
    const query = {
      ...(status && { status: Number(status) }),
      ...(role && { role: Number(role) }),
    };

    try {
      return await this.userModal
        .find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .populate('children');
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModal.findById(id).populate('children');
    } catch (error) {}
  }

  async changePassword(passwordDto: PasswordDto, userId: string) {
    try {
      const existedAccount = await this.findOne(userId);

      if (!existedAccount) {
        throw new BadRequestException({
          message: 'Tài khoản của bạn không tồn tại',
        });
      }

      if (
        !(await bcrypt.compare(
          passwordDto.old_password,
          existedAccount.password,
        ))
      ) {
        throw new BadRequestException({
          message: 'Mật khẩu cũ không chính xác',
        });
      }

      const password = await bcrypt.hash(passwordDto.new_password, 10);

      await this.userModal.findByIdAndUpdate(userId, {
        password,
      });

      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

      return {
        status: HttpStatus.CREATED,
        message: 'Thay đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfo(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const data = await this.userModal.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
        },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfoByAdmin(updateUserDto: UpdateUserDto, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được cập nhật người dùng',
      });
    }
    try {
      const { _id, ...rest } = updateUserDto;
      const data = await this.userModal.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async block(id: string, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được khóa người dùng',
      });
    }
    try {
      const user = await this.userModal.findById(id);

      await user.save();
      return {
        status: HttpStatus.OK,
        message: 'Thay đổi trạng thái thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id, role: number) {
    if (role !== 4) {
      throw new BadRequestException({
        message: 'You are not admin',
      });
    }
    try {
      await this.userModal.findByIdAndUpdate(id, { isDelete: 0 });

      return {
        status: HttpStatus.OK,
        message: 'Xóa người dùng thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
