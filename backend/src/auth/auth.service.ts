import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const user = new User();
    user.email = registerDto.email;
    user.password = hashedPassword;

    // Save the user
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(savedUser);

    // Return user (without password) and token
    const { password, ...result } = savedUser;
    return { user: result, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user (without password) and token
    const { password, ...result } = user;
    return { user: result, token };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
