import { Body, Controller, Post } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { UserAccountService } from '../../services/user-account/user-account.service';
import {
  UpdatePasswordDto,
  UpdateUserCredentials,
} from './update-credentials.dto';

@Controller('user/change')
export class UserAccountController {
  constructor(private readonly userService: UserAccountService) {}

  @Post('password')
  async changePassword(
    @GetUserId() userId: number,
    @Body() newPassword: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(userId, newPassword);
  }

  @Post('')
  async changeUsername(
    @GetUserId() userId: number,
    @Body() field: UpdateUserCredentials,
  ) {
    return await this.userService.updateUserCredential(userId, field);
  }
}
