import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @MinLength(4, {
    message: 'Name must be more than 3 characters',
  })
  name?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Invalid email format',
    },
  )
  email?: string;
}
