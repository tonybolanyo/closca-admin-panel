import { User } from './user.model';

describe('User Model', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
    expect(user instanceof User).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(user._id).toBeUndefined();
    expect(user.userName).toBeUndefined();
    expect(user.realName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.role).toBeUndefined();
  });

  it('should allow setting properties', () => {
    user._id = 'test-id';
    user.userName = 'testuser';
    user.email = 'test@example.com';
    user.role = 'ADMIN';
    user.isAdmin = true;
    user.closcaPoints = 100;
    user.totalRefills = 50;

    expect(user._id).toBe('test-id');
    expect(user.userName).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('ADMIN');
    expect(user.isAdmin).toBe(true);
    expect(user.closcaPoints).toBe(100);
    expect(user.totalRefills).toBe(50);
  });

  it('should handle all user properties', () => {
    const userData = {
      _id: 'user123',
      userName: 'johndoe',
      realName: 'John Doe',
      corporateCode: 'CORP123',
      name: 'John',
      phoneNumber: '+1234567890',
      email: 'john@example.com',
      password: 'securepass',
      emailVerfied: true,
      role: 'USER',
      isAdmin: false,
      avatarId: 'avatar123',
      closcaPoints: 250,
      totalRefills: 30
    };

    Object.assign(user, userData);

    expect(user._id).toBe(userData._id);
    expect(user.userName).toBe(userData.userName);
    expect(user.realName).toBe(userData.realName);
    expect(user.corporateCode).toBe(userData.corporateCode);
    expect(user.name).toBe(userData.name);
    expect(user.phoneNumber).toBe(userData.phoneNumber);
    expect(user.email).toBe(userData.email);
    expect(user.emailVerfied).toBe(userData.emailVerfied);
    expect(user.role).toBe(userData.role);
    expect(user.isAdmin).toBe(userData.isAdmin);
    expect(user.avatarId).toBe(userData.avatarId);
    expect(user.closcaPoints).toBe(userData.closcaPoints);
    expect(user.totalRefills).toBe(userData.totalRefills);
  });

  it('should handle undefined/null values gracefully', () => {
    user.email = null;
    user.role = undefined;
    user.closcaPoints = 0;

    expect(user.email).toBeNull();
    expect(user.role).toBeUndefined();
    expect(user.closcaPoints).toBe(0);
  });
});