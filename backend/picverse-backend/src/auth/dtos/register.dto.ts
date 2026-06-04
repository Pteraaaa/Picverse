import { IsEmail, Matches, MinLength } from 'class-validator';

export class registerDto {
    
    @MinLength(4, {
        message: 'Name must be more than 3 characters'
    }) name!: string;

    @IsEmail(
        {},
        {
            message: 'Invalid email format',
        }
    ) email!: string;

    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/,
        {
            message: 'Password must contain an uppercase, lowercase, and number'
        },
    ) password!: string;
}
