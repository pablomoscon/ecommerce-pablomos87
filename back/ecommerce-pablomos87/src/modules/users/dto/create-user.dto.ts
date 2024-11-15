import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/)
  password: string;

  @IsString()
  @Length(3, 80)
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  @Length(5, 20)
  country: string;

  @IsString()
  @Length(5, 20)
  city: string;

  @IsEmpty ()
  isAdmin: boolean;
}