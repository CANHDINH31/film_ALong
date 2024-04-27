import { IsOptional, IsString } from 'class-validator';

export class CreateAdvertismentDto {
  @IsOptional()
  @IsString()
  video1: string;

  @IsOptional()
  @IsString()
  video2: string;

  @IsOptional()
  @IsString()
  video3: string;

  @IsOptional()
  @IsString()
  video4: string;
}
