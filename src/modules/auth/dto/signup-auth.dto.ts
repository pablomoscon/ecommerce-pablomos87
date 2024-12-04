import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupAuthDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Length(3, 80, { message: 'Name must be between 3 and 80 characters long' })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be in a valid format' })
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'Password123!',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'Password must be between 8 and 15 characters, include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)'
  })
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'Password123!',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'Passwords do not match'
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Apt 4B',
  })
  @IsString()
  @Length(3, 80, { message: 'Address must be between 3 and 80 characters long' })
  address: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The country of residence of the user',
    example: 'United States',
  })
  @IsString()
  @Length(5, 20, { message: 'Country must be between 5 and 20 characters long' })
  country: string;

  @ApiProperty({
    description: 'The city of residence of the user',
    example: 'New York',
  })
  @IsString()
  @Length(5, 20, { message: 'City must be between 5 and 20 characters long' })
  city: string;

  @ApiProperty({
    description: 'The creation date of the user account',
    example: '2024-12-01T12:34:56Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  createdAt: string;

  constructor(partial: Partial<SignupAuthDto>) {
    Object.assign(this, partial)
  }
}