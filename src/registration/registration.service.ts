import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/registrationDto';
import { RegistrationRepository } from './repository/registration.repository';
import { RegistrationHelpers } from './helpers/registration.helpers';
import { Login, Result, JwtPayload } from './interface/registragion.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegistrationService {
  constructor(
    private registrationRepository: RegistrationRepository,
    private jwtService: JwtService,
  ) {}

  //SINGUP
  async singUp(createUserDto: CreateUserDto): Promise<Result> {
    //hash
    const hashPassword: string = await RegistrationHelpers.hashPassword(
      createUserDto.password,
    );

    // run service
    const result = await this.registrationRepository.create({
      email: createUserDto.email,
      password: hashPassword,
    });

    //return
    return {
      massage: 'Registration Successfully',
      id: result.id,
      email: result.email,
      meta: {},
    };
  }

  //LOGIN
  async login(data: Login): Promise<Result> {
    //compare password
    await RegistrationHelpers.comparePassword(
      data.password,
      data.user.password,
    );

    //create token
    const payload: JwtPayload = { id: data.user.id, email: data.user.email };
    const token: string = await this.jwtService.signAsync(payload);

    //check tokens
    let oldTokens = data.user.tokens || [];

    // filtration tokens that are less than 24 hours
    if (oldTokens.length) {
      oldTokens = oldTokens.filter((t) => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }

    // insert repository valid tokens
    await this.registrationRepository.login(data.user.id, oldTokens, token);

    //return
    return {
      massage: 'Login Successfully',
      id: data.user.id,
      email: data.user.email,
      meta: {
        token: token,
      },
    };
  }

  //LOGOUT
  async logout(user: JwtPayload): Promise<any> {
    const email: string = user.email;
    await this.registrationRepository.logout(email);

    //return
    return {
      massage: 'Logout Successfully',
      id: user.id,
      email: user.email,
      meta: {},
    };
  }
}
