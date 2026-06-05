import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSubmissionDto {
  @IsEmail(
    {},
    {
      message: 'Invalid email format',
    }
  )
  email!: string;

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

  isAiGenerated?: boolean | string;

  fileName?: string;

  fileUrl?: string;

  userId?: number | string;
}
