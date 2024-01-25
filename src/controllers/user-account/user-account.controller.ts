import { Body, Controller, Post } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { UserAccountService } from '../../services/user-account/user-account.service';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUsernameDto,
} from './update-credentials.dto';

@Controller('user')
export class UserAccountController {
  constructor(private readonly userService: UserAccountService) {}

  @Post('change/username')
  async changeUsername(
    @GetUserId() userId: number,
    @Body() username: UpdateUsernameDto,
  ) {
    return await this.userService.updateUserCredential<'username'>(
      userId,
      username,
    );
  }

  @Post('change/email')
  async changeEmail(
    @GetUserId() userId: number,
    @Body() email: UpdateEmailDto,
  ) {
    return await this.userService.updateUserCredential<'email'>(userId, email);
  }

  @Post('change/password')
  async changePassword(
    @GetUserId() userId: number,
    @Body() newPassword: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(userId, newPassword);
  }

  @Post('change/photo')
  async changePhoto(
    @GetUserId() userId: number,
    @Body() photo: { photo: string },
  ) {
    return await this.userService.updateUserCredential<'photo'>(
      userId,
      photo,
      false,
    );
  }
}
