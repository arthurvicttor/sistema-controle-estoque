import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({ example: "Notebook Dell Inspiron" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "Notebook com 16GB RAM e 512GB SSD" })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 3500.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity!: number;
}
