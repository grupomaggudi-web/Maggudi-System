import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test2@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
