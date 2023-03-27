import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'fsefds' } as User]),
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'fresfs', password: 'fdsfe' } as User),
    };
    fakeAuthService = {
      signUp: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
      signIn: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const user = await controller.findAllUsers('qwer@qwer.com');
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('qwer@qwer.com');
  });

  it('findUser, 아이디로 1명의 유저를 찾음', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
    expect(user).toBeDefined();
  });

  it('findUser, 존재하지 않는 id를 입력하면 404 에러를 발생', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
