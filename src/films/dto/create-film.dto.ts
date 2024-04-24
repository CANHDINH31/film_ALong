import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  poster: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsArray()
  category?: string[];

  @IsNotEmpty()
  @IsString()
  user: string;
}
