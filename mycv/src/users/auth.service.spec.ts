import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  const users: User[] = [];

  beforeEach(async () => {
    fakeUsersService = {
      find: (email) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: async (email: string, password: string) => {
        const user = { id: Math.random() * 9999, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('auth service instans', async () => {
    expect(service).toBeDefined();
  });

  it('create user with hash and salt', async () => {
    const user = await service.signUp('test@test.com', 'password');

    expect(user.password).not.toEqual('abcd');
    const [hash, salt] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('test1323@test.com', 'abfse');

    await expect(service.signUp('test1323@test.com', 'abcd')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('fnsjkfhuso@test.com', 'fsnjkef'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await expect(service.signIn('test@test.com', 'password1')).rejects.toThrow(
      BadRequestException,
    );
  });
});
