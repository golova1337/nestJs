import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/registrationDto';
import { RegistrationService } from './registration.service';
import { RegistrationResponse } from './interface/registrationResponse';
import {
  JwtPayload,
  Login,
  ResponseSuccsesfully,
  Result,
} from './interface/registragion.interface';
import { Guard } from './guard/registration.guard';

@Controller()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('/singup')
  async singUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseSuccsesfully> {
    // run the service
    const result: Result = await this.registrationService.singUp(createUserDto);
    //create response
    return RegistrationResponse.succsessfully(result);
  }

  @Get('login')
  async login(@Body() login: Login): Promise<ResponseSuccsesfully> {
    // run the service
    const result: Result = await this.registrationService.login(login);

    //create response
    return RegistrationResponse.succsessfully(result);
  }

  // trein
  @UseGuards(Guard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user: JwtPayload = req['user'];

    const result = await this.registrationService.logout(user);
    return RegistrationResponse.succsessfully(result);
  }
}
