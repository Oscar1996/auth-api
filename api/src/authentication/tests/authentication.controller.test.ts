import request from 'supertest';
import App from '../../index';
import AuthenticationController from '../authentication.controller';
import userModel from '../../Users/user.model';
import User from '../../Users/user.interface';
import { userOne, setupDatabase, endDatabase } from '../../jest/testDb';

const url = '@nodejs-raroh.mongodb.net/shopx-test?retryWrites=true&w=majority';
const app = new App([new AuthenticationController()]);
const user = userModel;
const authenticationController = new AuthenticationController();
beforeAll(setupDatabase(url));
afterAll(endDatabase);
describe('The Authentication Controller', () => {
  describe('POST /api/auth/register', () => {
    describe('If the email is not taken', () => {
      it('Should sign up a new user', async () => {
        const response = await request(app.getServer())
          .post(`/api${authenticationController.path}/register`)
          .send({
            firstName: 'Oscar',
            lastName: 'Valdivia',
            email: 'oscar@example.com',
            password: 'MyPass777!'
          })
          .expect(201)
          .expect('auth-token', /.*/); // Assert that the auth-token header is applied

        // Assert that the database was changed correctly
        const userData: User = await user.findById(response.body._id);
        expect(user).not.toBeNull();

        // Assertions about the response
        expect(response.body).toMatchObject({
          firstName: 'Oscar',
          lastName: 'Valdivia',
          email: 'oscar@example.com',
          tokens: [
            {
              token: userData.tokens[0].token
            }
          ]
        });
        expect(userData.password).not.toBe('MyPass777!');
      });
    });
    describe('If the email is taken', () => {
      it('Should not register a new user', async () => {
        const response = await request(app.getServer())
          .post(`/api${authenticationController.path}/register`)
          .send({
            firstName: 'Oscar',
            lastName: 'Valdivia',
            email: 'oscar@example.com',
            password: 'MyPass777!'
          })
          .expect(404);
        const userData: User = await user.findById(response.body._id);
        // Assert that the database was not changed
        expect(userData).toBeNull();
      });
    });
  });

  describe('POST /api/auth/login', () => {
    describe('If the user is registered', () => {
      it('Should login the user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/login`)
          .send({
            email: userOne.email,
            password: userOne.password
          })
          .expect(200);
        // login the same account to have two tokens
        await request(app.getServer())
          .post(`/api${authenticationController.path}/login`)
          .send({
            email: userOne.email,
            password: userOne.password
          })
          .expect(200);
      });
    });

    describe('If the user is not registered', () => {
      it('Should not login the user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/login`)
          .send({
            email: userOne.email,
            password: 'notpassforuserone'
          })
          .expect(401);
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    describe('If the user is logged in', () => {
      it('Should logout the current user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/logout`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200);
      });
    });
    describe('If the user is not logged in', () => {
      it('Should not logout the user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/logout`)
          .set('Authorization', `Bearer xdxdxd`)
          .send()
          .expect(401);
      });
    });
  });

  describe('POST /api/auth/logout/all', () => {
    describe('If the user is logged in', () => {
      it('Should logout all the session of that user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/logout/all`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200);
      });
    });
    describe('If the user is not logged in', () => {
      it('Should not logout all the session of that user', async () => {
        await request(app.getServer())
          .post(`/api${authenticationController.path}/logout/all`)
          .set('Authorization', `Bearer nototkenxd`)
          .send()
          .expect(401);
      });
    });
  });
});
