import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegistrationhDto } from '../dto/auth-dto';
import { AuthRepository } from '../repository/auth.repository';
import { compare, compareSync, hash } from 'bcryptjs';
import { TokenService } from './token.servise';
import { LoginDto } from '../dto/login-dto';
import { EmojiLogger } from 'src/utils/logger/LoggerService';

@Injectable()
export class AuthService {
  private readonly logger = new EmojiLogger();
  constructor(
    private authRepository: AuthRepository,
    private tokenService: TokenService,
  ) {}

  //SINGUP
  async singUp(user: RegistrationhDto) {
    //hash
    const hashPassword: string = await hash(user.password, 10);

    // run service
    const createUser = await this.authRepository
      .save({
        email: user.email,
        password: hashPassword,
      })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers');
      });

    //return
    return {
      message: 'Registration is Successful',
      meta: {},
    };
  }

  //LOGIN
  async login(data: LoginDto) {
    // check user in DB
    const user = await this.authRepository.findOne(data.email).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Servers Error');
    });

    //compare password

    if (!user || !compareSync(data.password, user.password)) {
      throw new BadRequestException('Incorrect password or email');
    }

    //create access, refresh token
    const { accessToken, refreshToken } = await this.tokenService
      .getTokens(user._id, user.role)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers Error');
      });

    //update refreshToken
    await this.authRepository
      .updateRefreshToken(user._id, refreshToken)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers');
      });

    //   //return
    return {
      message: 'Login Successfully',
      data: {
        accessToken,
        refreshToken,
      },
      meta: {},
    };
  }

  //logout
  async logout(id: string) {
    const result = await this.authRepository.logout(id).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Servers Error');
    });

    //   //return
    return {
      message: 'Logout Successfully',
      data: { accessToken: null, refreshToken: null },
      meta: {},
    };
  }

  //refresh
  async refreshTokens(userId: string, refreshTokenOld: string) {
    //get user

    const user = await this.authRepository.findById(userId);
    if (!user || !user.refreshToken.token)
      throw new ForbiddenException('Access Denied');

    //compare refresh token

    const refreshTokenMatches = await compare(
      refreshTokenOld,
      user.refreshToken.token,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    //get new refresh token
    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      user.id,
      user.role,
    );

    //update refresh token DB
    await this.authRepository.updateRefreshToken(user.id, refreshToken);
    return {
      message: 'Refresh Successfully',
      data: { accessToken, refreshToken },
      meta: {},
    };
  }
}
