import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @Length(3, 80, { message: 'The name must be between 3 and 80 characters long.' })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'The password for the user (must include at least one uppercase letter, one lowercase letter, one number, and one special character)',
    example: 'Password123!',
  })
  @IsString({ message: 'The password must be a string.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'The password must be between 8 and 15 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Springfield',
  })
  @IsString({ message: 'The address must be a string.' })
  @Length(3, 80, { message: 'The address must be between 3 and 80 characters long.' })
  address: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'The phone number cannot be empty.' })
  @IsString({ message: 'The phone number must be a string.' })
  phone: string;

  @ApiProperty({
    description: 'The country of the user',
    example: 'United States',
  })
  @IsString({ message: 'The country must be a string.' })
  @Length(5, 20, { message: 'The country name must be between 5 and 20 characters long.' })
  country: string;

  @ApiProperty({
    description: 'The city of the user',
    example: 'New York',
  })
  @IsString({ message: 'The city must be a string.' })
  @Length(5, 20, { message: 'The city name must be between 5 and 20 characters long.' })
  city: string;

  @ApiProperty({
    description: 'The creation date of the user account (optional)',
    example: '2024-12-03T14:00:00Z',
    required: false,
  })
  @IsString({ message: 'The createdAt field must be a string.' })
  @IsOptional()
  createdAt: string;
}