import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateFilmDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  poster: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsArray()
  category?: string[];
}
