import request from 'supertest';
import App from '../../index';
import PostController from '../post.controller';
import postModel from '../post.model';
import Post from '../post.interface';
import { userOne, userTwo, setupDatabase, endDatabase, postOne, postThree } from '../../jest/testDb';

const url = '@nodejs-raroh.mongodb.net/shopx3-test?retryWrites=true&w=majority';
const app = new App([new PostController()]);
const post = postModel;
const postController = new PostController();
beforeAll(setupDatabase(url));
afterAll(endDatabase);

describe('The Post Controller', () => {
  describe('GET /api/posts/', () => {
    describe('When the user is logged in', () => {
      it('Should return all posts of a single user', async () => {
        const response = await request(app.getServer())
          .get(`/api${postController.path}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .expect(200);
        expect(response.body.length).toEqual(2);
      });
    });
    describe('When the user is not logged in', () => {
      it('Should not return the posts', async () => {
        await request(app.getServer())
          .get(`/api${postController.path}`)
          .set('Authorization', `Bearer someramofdkshghse`)
          .expect(401);
      });
    });
  });

  describe('GET /api/posts/:id', () => {
    describe('When the user is logged in', () => {
      it('Should return a post', async () => {
        await request(app.getServer())
          .get(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .expect(200);
      });
    });
    describe('When the user fetch some other users post', () => {
      it('Should not return a post', async () => {
        const response = await request(app.getServer())
          .get(`/api${postController.path}/${postThree._id}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .expect(200);
        expect(response.body.length).toEqual(0);
      });
    });
    describe('When the user is not logged in and other post id', () => {
      it('Should not return the post', async () => {
        await request(app.getServer())
          .get(`/api${postController.path}/601cbdc1a7a2ad0081c47242`)
          .set('Authorization', `Bearer someramofdkshghse`)
          .expect(401);
      });
    });
  });

  describe('POST /api/posts', () => {
    describe('When the user is logged in', () => {
      it('Should create a post', async () => {
        await request(app.getServer())
          .post(`/api${postController.path}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
            content: 'This is a test content',
            title: 'This is a test title'
          })
          .expect(201);
      });
    });
    describe('When the user is not logged in', () => {
      it('Should not create a post', async () => {
        await request(app.getServer())
          .post(`/api${postController.path}`)
          .set('Authorization', `Bearer ccccccccccccccc`)
          .send({
            content: 'This is a test content',
            title: 'This is a test title'
          })
          .expect(401);
      });
    });
  });

  describe('PATCH /api/posts/:id', () => {
    describe('When the user is logged in', () => {
      it('Should update the post', async () => {
        await request(app.getServer())
          .patch(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
            content: 'This is a update test content',
            title: 'This is a update test title'
          })
          .expect(200);
      });
    });
    describe('When the user try to update some other users post', () => {
      it('Should not update the post', async () => {
        const response = await request(app.getServer())
          .patch(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .send({
            content: 'This is a update test content',
            title: 'This is a update test title'
          })
          .expect(200);
        expect(response.body.n).toEqual(0);
      });
    });
    describe('When the user is not logged in', () => {
      it('Should not create a post', async () => {
        await request(app.getServer())
          .patch(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ccccccccccccccc`)
          .send({
            content: 'This is a test content',
            title: 'This is a test title'
          })
          .expect(401);
      });
    });
  });

  describe('DELETE /api/posts/:id', () => {
    describe('When the user is logged in', () => {
      it('Should delete the post', async () => {
        await request(app.getServer())
          .delete(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .expect(200);
      });
    });
    describe('When the user try to delete some other users post', () => {
      it('Should not delete the post', async () => {
        const response = await request(app.getServer())
          .delete(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
          .expect(200);
        expect(response.body.n).toEqual(0);
      });
    });
    describe('When the user is not logged in', () => {
      it('Should not delete a post', async () => {
        await request(app.getServer())
          .delete(`/api${postController.path}/${postOne._id}`)
          .set('Authorization', `Bearer ccccccccccccccc`)
          .expect(401);
      });
    });
  });
});
