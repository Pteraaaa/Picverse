import { IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class CreateArtworkDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(50, { message: 'Title must be at most 50 characters' })
  @Matches(/^[A-Z]/, { message: 'Title must start with a capital letter' })
  title!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description!: string;

  @IsNotEmpty({ message: 'Tags are required' })
  tags!: string | string[];

  @IsOptional()
  isAiGenerated?: string | boolean;
}
