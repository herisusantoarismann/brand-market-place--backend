import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './shared/dto/register.dto';
import { IUser } from './shared/interfaces/user.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.auth.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.auth.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateToken(user?.email);
    const refreshToken = this.generateToken(user?.email, '7d');

    const newUser = await this.prisma.auth.update({
      where: {
        email,
      },
      data: {
        refreshToken,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return {
      ...newUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private generateToken(email: string, expires: string = '1d'): string {
    const payload = { email: email };
    return this.jwtService.sign(payload, { expiresIn: expires });
  }

  comparePassword(enteredPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, hash);
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.findByEmail(email);

    if (user && (await this.comparePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
