import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import type { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser = async (supabaseId: string): Promise<User> => {
    const existingUser = await this.getUser(supabaseId);
    const user = existingUser
      ? existingUser
      : await this.userRepository.save(
          this.userRepository.create({ supabaseId }),
        );
    return user;
  };

  getUser = (supabaseId: string): Promise<User | null> => {
    return this.userRepository.findOne({
      where: {
        supabaseId,
      },
    });
  };
}
