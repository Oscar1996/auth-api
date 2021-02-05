import AuthenticationService from '../authentication.service';
import User from '../../Users/user.interface';

const userData: User = {
  _id: '600e3b19baced8015fb26b72',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  email: 'test@test.com',
  password: 'xhehf3$64@^&',
  tokens: [{ token: 'testToken' }]
};

describe('The AuthenticationService', () => {
  const authenticationService = new AuthenticationService();
  describe('When creating a token', () => {
    it('should return a string', () => {
      expect(typeof authenticationService.createToken(userData)).toEqual('string');
    });
  });
});
