import { Body, Controller, Post } from '@nestjs/common';
import { GetUserId } from 'src/modules/auth/decorators/get-user';
import { UnitOfWorkService } from 'src/modules/unit-of-work/unit-of-work.service';
import { UserService } from 'src/services/user/user.service';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUsernameDto,
} from './update-credentials.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly userService: UserService,
  ) {}

  @Post('change/username')
  async changeUsername(
    @GetUserId() userId: number,
    @Body() username: UpdateUsernameDto,
  ) {
    return await this.userService.updateUserCredential<'email'>(
      userId,
      username,
    );
  }

  @Post('change/email')
  async changeEmail(
    @GetUserId() userId: number,
    @Body() email: UpdateEmailDto,
  ) {
    return await this.userService.updateUserCredential<'username'>(
      userId,
      email,
    );
  }

  @Post('change/password')
  async changePassword(
    @GetUserId() userId: number,
    @Body() newPassword: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(userId, newPassword);
  }
}
