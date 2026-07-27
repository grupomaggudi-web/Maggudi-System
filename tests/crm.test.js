import request from 'supertest';
import app from '../src/server.js';
import Customer from '../src/models/Customer.js';

describe('CRM Routes', () => {
  let token;
  let customerId;

  beforeAll(async () => {
    await Customer.sync({ force: true });
  });

  describe('POST /api/crm/customers', () => {
    it('should create a customer', async () => {
      const response = await request(app)
        .post('/api/crm/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Acme Inc',
          email: 'contact@acme.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          status: 'customer',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      customerId = response.body.id;
    });
  });

  describe('GET /api/crm/customers', () => {
    it('should get all customers', async () => {
      const response = await request(app)
        .get('/api/crm/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/crm/customers/:id/interactions', () => {
    it('should create an interaction', async () => {
      const response = await request(app)
        .post(`/api/crm/customers/${customerId}/interactions`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'email',
          notes: 'Follow-up email sent',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
