import { IsString, Length, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class UpdateBookDTO {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  createdAt: Date;
  updatedAt: Date;
}
