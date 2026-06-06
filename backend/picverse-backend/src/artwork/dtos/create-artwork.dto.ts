import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateArtworkDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description!: string;

  @IsNotEmpty({ message: 'Tags are required' })
  @IsString()
  tags!: string;
}
