import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";
import { adminUsers } from "./admin-user-mock.seed";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminUsersSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async seed() {

    const existingAdminUsers = (await this.userRepository.find()).map(
      (user) => user.email,
    );

    for (const adminUsersData of adminUsers) {
      if (!existingAdminUsers.includes(adminUsersData.email)) {
        const user = new User();
        user.email = adminUsersData.email;
        user.name = adminUsersData.name;
        const hashedPassword = await bcrypt.hash(adminUsersData.password, 10);
        user.password = hashedPassword;
        user.address = adminUsersData.address;
        user.phone = adminUsersData.phone;
        user.country = adminUsersData.country;
        user.city = adminUsersData.city;
        user.role = adminUsersData.role;

        await this.userRepository.save(user);
      }
    }
  }
}