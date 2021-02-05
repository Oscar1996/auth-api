import request from 'supertest';
import App from '../../index';
import UserController from '../user.controller';
import userModel from '../user.model';
import User from '../user.interface';
import { userTwo, setupDatabase, endDatabase } from '../../jest/testDb';

const app = new App([new UserController()]);
const user = userModel;
const userController = new UserController();
const url = '@nodejs-raroh.mongodb.net/shopx2-test?retryWrites=true&w=majority';
beforeAll(setupDatabase(url));
afterAll(endDatabase);
describe('The User Controller', () => {
  describe('GET /api/users/current-user', () => {
    describe('If the user if logged in', () => {
      it('Should return the user info', async () => {
        const response = await request(app.getServer())
          .get(`/api${userController.path}/current-user`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .expect(200);
        expect(response).not.toBeNull();
      });
    });
    describe('If the user if not logged in', () => {
      it('Should not return the user', async () => {
        await request(app.getServer())
          .get(`/api${userController.path}/current-user`)
          .set('Authorization', `Bearer dsfdsfdsfsdfs`)
          .expect(401);
      });
    });
  });

  describe('GET /api/users/posts', () => {
    describe('If the user if logged in', () => {
      it("Should return the user's posts", async () => {
        const response = await request(app.getServer())
          .get(`/api${userController.path}/posts`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .expect(200);
        expect(response).not.toBeNull();
      });
    });
    describe('If the user if not logged in', () => {
      it("Should not return user's posts", async () => {
        await request(app.getServer())
          .get(`/api${userController.path}/posts`)
          .set('Authorization', `Bearer dsfdsfdsfsdfs`)
          .expect(401);
      });
    });
  });

  describe('PATCH /api/users/modify-user', () => {
    describe('If the user if logged in', () => {
      it('Should update the user', async () => {
        await request(app.getServer())
          .patch(`/api${userController.path}/modify-user`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .send({
            firstName: 'Pedro'
          })
          .expect(200);
        const userData: User = await user.findById(userTwo._id);
        expect(userData.firstName).toEqual('Pedro');
      });
    });
    describe('If the user if logged in', () => {
      it('Should not update the user with bad information', async () => {
        await request(app.getServer())
          .patch(`/api${userController.path}/modify-user`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .send({
            firstName: 33
          })
          .expect(400);
      });
    });
  });
  describe('DELETE /api/users/delete-user', () => {
    describe('If the user if logged in', () => {
      it('Should delete the user', async () => {
        await request(app.getServer())
          .delete(`/api${userController.path}/delete-user`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .expect(200);
      });
    });
    describe('If the user if not logged in', () => {
      it('Should not delete the user', async () => {
        await request(app.getServer())
          .delete(`/api${userController.path}/delete-user`)
          .set('Authorization', `Bearer dsfdsfdsfsdfs`)
          .expect(401);
      });
    });
  });
});
