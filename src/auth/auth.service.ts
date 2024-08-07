import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/Validations/userDTO';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }
    
    async createUser(user: CreateUserDTO) {
        return this.userService.createUser(user)
    }
}
