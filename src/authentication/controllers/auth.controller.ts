import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { RegistrationhDto } from '../dto/auth-dto';
import { AuthService } from '../services/auth.service';
import { Response } from '../../helpers/response/Response';
import { Result } from '../interface/auth-interface';
import { LoginDto } from '../dto/login-dto';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/utils/common/guard/jwt/refreshToken.guard';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/utils/common/decorators/public/public.decorator';
import { ApiErrorDecorator } from 'src/utils/common/decorators/error/error.decorator';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //singup
  @Post('/singUp')
  @Public()
  @HttpCode(201)
  @ApiBody({
    type: RegistrationhDto,
    required: true,
    description: 'registration data',
  })
  @ApiOperation({ summary: 'personalized record creation ' })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request ', 'Bad Requste')
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
  async singUp(@Body() user: RegistrationhDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.singUp(user);
    //create response
    return Response.succsessfully(result);
  }

  //login
  @Get('login')
  @Public()
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: 'Log in' })
  @ApiErrorDecorator(
    HttpStatus.BAD_REQUEST,
    'Bad Request || Incorrect password or email',
    'Bad Requste',
  )
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
  async login(@Body() user: LoginDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.login(user);

    //create response
    return Response.succsessfully(result);
  }

  // logout
  @Get('logout')
  @Roles('user')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @ApiOperation({ description: 'Log out' })
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
  async logout(@Req() req: Request): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.logout(req.user['id']);

    //create response
    return Response.succsessfully(result);
  }

  //refresh

  @Get('refresh')
  @Public()
  @Roles('user')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiErrorDecorator(HttpStatus.FORBIDDEN, 'Forbidden', 'Access Denied')
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
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
