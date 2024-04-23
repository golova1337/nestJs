import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationhDto } from './dto/auth-dto';
import { AuthService } from './services/auth.service';
import { Response } from '../helpers/response/Response';
import { Result } from './interface/auth-interface';
import { LoginDto } from './dto/login-dto';
import { AccessTokenGuard } from 'src/utils/common/accessToken.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/utils/common/refreshToken.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { responseSuccesfully } from '../helpers/types/response-type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/api/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //singup
  @Post('/singUp')
  @HttpCode(201)
  @ApiBody({ type: RegistrationhDto })
  @ApiCreatedResponse({ description: 'ok' })
  async singUp(@Body() user: RegistrationhDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.singUp(user);
    //create response
    return Response.succsessfully(result);
  }

  //login
  @Get('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  async login(@Body() user: LoginDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.login(user);

    //create response
    return Response.succsessfully(result);
  }

  // logout
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @Get('logout')
  async logout(@Req() req: Request): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.logout(req.user['id']);

    //create response
    return Response.succsessfully(result);
  }

  //refresh
  @ApiBearerAuth()
  @Roles('user')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('refresh')
  async refreshTokens(@Req() req: Request): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    const refreshToken = req.user['refreshToken'];

    const result: Result = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );

    //create response
    return Response.succsessfully(result);
  }
}
