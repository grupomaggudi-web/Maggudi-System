import request from 'supertest';
import app from '../src/server.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';

describe('Inventory Routes', () => {
  let token;
  let categoryId;

  beforeAll(async () => {
    await Product.sync({ force: true });
    await Category.sync({ force: true });
  });

  describe('POST /api/inventory/categories', () => {
    it('should create a category', async () => {
      const response = await request(app)
        .post('/api/inventory/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Electronics',
          description: 'Electronic products',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      categoryId = response.body.id;
    });
  });

  describe('POST /api/inventory/products', () => {
    it('should create a product', async () => {
      const response = await request(app)
        .post('/api/inventory/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          description: 'High performance laptop',
          price: 999.99,
          categoryId,
          sku: 'LAP-001',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('GET /api/inventory/products', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/inventory/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
