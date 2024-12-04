import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';
import { SeedsModule } from './seeds/seeds.module';
import { FilesModule } from './modules/files/files.module';
import { CloudinaryService } from './service/cloudinary/cloudinary.service';
import { CloudinaryConfig } from './config/cloudinary.config';
import { JwtModule } from '@nestjs/jwt';
import {
    postgresDataSourceConfig,
    sqliteDataSourceConfig,
} from './config/database.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                postgresDataSourceConfig,
                sqliteDataSourceConfig,
                () => ({
                    environment: process.env.ENVIRONMENT || 'TEST',
                }),
            ],
            envFilePath: ['.env', '.env.development.local'],
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('environment') === 'TEST'
                    ? configService.get('sqlite')
                    : configService.get('postgres')
        }),

        JwtModule.register({
            global: true,

            signOptions: { expiresIn: '1h' },

            secret: process.env.JWT_SECRET,
        }),
        UsersModule,
        ProductsModule,
        AuthModule,
        OrdersModule,
        CategoriesModule,
        OrderDetailsModule,
        SeedsModule,
        FilesModule,
    ],
    controllers: [],
    providers: [CloudinaryService, CloudinaryConfig],
})
export class AppModule { }
