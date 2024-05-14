import {
  Body,
  Controller,
  Post,
  HttpCode,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { RegistrationhDto } from '../dto/auth-dto';
import { AuthService } from '../services/auth.service';
import { Response } from '../../helpers/response/Response';
import { LoginDto } from '../dto/login-dto';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/utils/common/guard/jwt/refreshToken.guard';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { CommonResponse } from 'src/helpers/types/response-type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/utils/common/decorators/public/public.decorator';
import { ApiErrorDecorator } from 'src/utils/common/decorators/error/error.decorator';

@Controller()
@ApiTags('Auth')
@ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request ', 'Bad Requste')
@ApiErrorDecorator(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Servers Error',
  'Internal Servers Error',
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //singup

  @HttpCode(201)
  @Public()
  @ApiOperation({
    summary: 'Registration',
    description:
      'creating personalized records, if you are registered, you cannot create a second account   ',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  @Post('singUp')
  async singUp(
    @Body() user: RegistrationhDto,
  ): Promise<CommonResponse<undefined>> {
    // run the service
    const result = await this.authService.singUp(user);
    //create response
    return Response.succsessfully(result);
  }

  //login
  @Post('login')
  @Public()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Log in',
    description: 'You can log into your account',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async login(
    @Body() user: LoginDto,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    // run the service
    const result = await this.authService.login(user);

    //create response
    return Response.succsessfully(result);
  }

  // logout
  @Post('logout')
  // @Public()
  @Roles('user')
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Log out ',
    description:
      'You can log out of your account and remove access and update tokens',
  })
  @ApiBearerAuth()
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async logout(
    @Req() req: Request,
  ): Promise<CommonResponse<{ accessToken: null; refreshToken: null }>> {
    // run the service
    const result = await this.authService.logout(req.user['id']);

    //create response
    return Response.succsessfully(result);
  }

  //refresh

  @Post('refresh')
  @Public()
  @Roles('user')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiErrorDecorator(HttpStatus.FORBIDDEN, 'Forbidden', 'Access Denied')
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  @ApiOperation({
    summary: 'Update access token',
    description:
      'To refresh the access token, go back to the Login endpoint, grab the Refresh token, and insert it into the Authorize field of the Refresh endpoint (click the lock).',
  })
  async refreshTokens(
    @Req() req: Request,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const userId = req.user['id'];

    const refreshToken = req.user['refreshToken'];

    const result = await this.authService.refreshTokens(userId, refreshToken);

    //create response
    return Response.succsessfully(result);
  }
}
