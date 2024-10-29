import { IsString, IsEmail, Length, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(20, 25)
    name: string;

    @IsEmail()
    email: string;

    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Password too weak' }
    )
    password: string;

    @IsString()
    @Length(10, 15)
    phone: string;

    @IsString()
    @Length(2, 50)
    country: string;

    @IsString()
    @Length(2, 50)
    city: string;

    @IsString()
    @Length(5, 100)
    address: string;
}