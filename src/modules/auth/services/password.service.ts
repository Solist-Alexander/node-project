import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Config } from '../../../configs/configs.type';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService<Config>) {}

  public async hashPassword(password: string): Promise<string> {
    const hashRounds = this.configService.get<number>('hashRounds');
    return await bcrypt.hash(password, hashRounds);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
