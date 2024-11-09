import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres' })
  name: string;

  @IsEmail({}, { message: 'El correo electrónico debe tener una estructura válida' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)'
  })
  password: string;

  @IsString()
  @Length(3, 80, { message: 'La dirección debe tener entre 3 y 80 caracteres' })
  address: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsString()
  phone: string;

  @IsString()
  @Length(5, 20, { message: 'El país debe tener entre 5 y 20 caracteres' })
  country: string;

  @IsString()
  @Length(5, 20, { message: 'La ciudad debe tener entre 5 y 20 caracteres' })
  city: string;
}