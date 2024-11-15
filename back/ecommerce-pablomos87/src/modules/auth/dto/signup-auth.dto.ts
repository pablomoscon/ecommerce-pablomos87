import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsEmpty } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Length(3, 80, { message: 'Name must be between 3 and 80 characters long' })
  name: string;

  @IsEmail({}, { message: 'Email must be in a valid format' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'Password must be between 8 and 15 characters, include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)'
  })
  password: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'Passwords do not match'
  })
  confirmPassword: string;

  @IsString()
  @Length(3, 80, { message: 'Address must be between 3 and 80 characters long' })
  address: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @IsString()
  @Length(5, 20, { message: 'Country must be between 5 and 20 characters long' })
  country: string;

  @IsString()
  @Length(5, 20, { message: 'City must be between 5 and 20 characters long' })
  city: string;

  @IsEmpty()
  isAdmin: boolean;
}