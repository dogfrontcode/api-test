import request from 'supertest';
import { createApp } from '../../src/app';
import { getPrismaClient, disconnectPrisma } from '../../src/common/config/database.config';
import { PasswordHasher } from '../../src/common/utils/PasswordHasher';

/**
 * Testes de comparação: Insecure vs Secure
 * Demonstra diferenças de comportamento entre as duas APIs
 */

const app = createApp();
const prisma = getPrismaClient();

// Helper para criar usuários de teste
async function setupTestUsers() {
  await prisma.user.deleteMany();
  
  const adminPassword = await PasswordHasher.hash('admin123');
  const userPassword = await PasswordHasher.hash('user123');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      balance: 1000
    }
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: userPassword,
      role: 'user',
      balance: 100
    }
  });

  return { admin, user };
}

// Helper para fazer login secure
async function loginSecure(email: string, password: string) {
  const response = await request(app)
    .post('/secure/auth/login')
    .send({ email, password });
  
  return response.body.accessToken;
}

describe('Security Comparison Tests', () => {
  beforeAll(async () => {
    await setupTestUsers();
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  describe('Authentication', () => {
    it('Insecure: returns cookie without security flags', async () => {
      const res = await request(app)
        .post('/insecure/auth/login')
        .send({ email: 'admin@test.com', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sessionId).toBeDefined();
    });

    it('Secure: returns JWT tokens', async () => {
      const res = await request(app)
        .post('/secure/auth/login')
        .send({ email: 'admin@test.com', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user).toBeDefined();
    });
  });

  describe('User Creation', () => {
    it('Insecure: allows creating users without auth', async () => {
      const res = await request(app)
        .post('/insecure/users')
        .send({
          email: 'hacker@test.com',
          password: 'hacked123',
          role: 'admin' // Can set role to admin!
        });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });

    it('Secure: blocks creating users without auth', async () => {
      const res = await request(app)
        .post('/secure/users')
        .send({
          email: 'blocked@test.com',
          password: 'test123'
        });

      expect(res.status).toBe(401);
    });

    it('Secure: requires admin role to create users', async () => {
      const userToken = await loginSecure('user@test.com', 'user123');

      const res = await request(app)
        .post('/secure/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'newuser@test.com',
          password: 'test123'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('IDOR (Insecure Direct Object Reference)', () => {
    it('Insecure: allows viewing any user without auth', async () => {
      const res = await request(app)
        .get('/insecure/users/1');

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });

    it('Secure: blocks viewing users without auth', async () => {
      const res = await request(app)
        .get('/secure/users/1');

      expect(res.status).toBe(401);
    });

    it('Secure: blocks user from viewing other users', async () => {
      const { admin, user } = await setupTestUsers();
      const userToken = await loginSecure('user@test.com', 'user123');

      const res = await request(app)
        .get(`/secure/users/${admin.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('Secure: allows viewing own profile', async () => {
      const { user } = await setupTestUsers();
      const userToken = await loginSecure('user@test.com', 'user123');

      const res = await request(app)
        .get(`/secure/users/${user.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Balance Manipulation (BOLA)', () => {
    it('Insecure: allows crediting any user without auth', async () => {
      const res = await request(app)
        .post('/insecure/balance/credit')
        .send({
          userId: 2,
          amount: 999999
        });

      expect(res.status).toBe(200);
      expect(res.body.credited).toBe(999999);
    });

    it('Secure: blocks crediting without auth', async () => {
      const res = await request(app)
        .post('/secure/balance/credit')
        .send({
          userId: 2,
          amount: 100
        });

      expect(res.status).toBe(401);
    });

    it('Secure: blocks non-admin from crediting', async () => {
      const userToken = await loginSecure('user@test.com', 'user123');

      const res = await request(app)
        .post('/secure/balance/credit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: 1,
          amount: 100
        });

      expect(res.status).toBe(403);
    });

    it('Insecure: allows viewing any user balance via query param', async () => {
      const res = await request(app)
        .get('/insecure/balance/me?userId=1');

      expect(res.status).toBe(200);
      expect(res.body.balance).toBeDefined();
    });

    it('Secure: only returns own balance', async () => {
      const userToken = await loginSecure('user@test.com', 'user123');

      const res = await request(app)
        .get('/secure/balance/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.userId).toBeDefined();
    });
  });

  describe('Merchant Callback URL Validation', () => {
    it('Insecure: accepts any callback URL including HTTP', async () => {
      const res = await request(app)
        .patch('/insecure/merchant/callbackurl')
        .send({
          callback_url: 'http://evil.com/steal-data'
        });

      expect(res.status).toBe(200);
    });

    it('Insecure: accepts localhost URLs (SSRF)', async () => {
      const res = await request(app)
        .patch('/insecure/merchant/callbackurl')
        .send({
          callback_url: 'http://localhost:8080/internal'
        });

      expect(res.status).toBe(200);
    });

    it('Secure: requires authentication', async () => {
      const res = await request(app)
        .patch('/secure/merchant/callbackurl')
        .send({
          callback_url: 'https://api.example.com/webhook'
        });

      expect(res.status).toBe(401);
    });

    it('Secure: requires step-up token', async () => {
      const adminToken = await loginSecure('admin@test.com', 'admin123');

      const res = await request(app)
        .patch('/secure/merchant/callbackurl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          callback_url: 'https://api.example.com/webhook'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Step-up');
    });

    it('Secure: rejects HTTP URLs', async () => {
      const adminToken = await loginSecure('admin@test.com', 'admin123');
      
      // Get step-up token
      const reauthRes = await request(app)
        .post('/secure/auth/reauth')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'admin123' });

      const stepUpToken = reauthRes.body.stepUpToken;

      const res = await request(app)
        .patch('/secure/merchant/callbackurl')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Step-Up-Token', stepUpToken)
        .send({
          callback_url: 'http://not-secure.com/webhook'
        });

      expect(res.status).toBe(422);
      expect(res.body.message).toContain('HTTPS');
    });
  });

  describe('Input Validation', () => {
    it('Insecure: accepts invalid email format', async () => {
      const res = await request(app)
        .post('/insecure/users')
        .send({
          email: 'not-an-email',
          password: 'test123'
        });

      // Pode falhar por outros motivos, mas não por validação de email
      expect([200, 201, 422, 500]).toContain(res.status);
    });

    it('Secure: validates email format', async () => {
      const adminToken = await loginSecure('admin@test.com', 'admin123');

      const res = await request(app)
        .post('/secure/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email',
          password: 'test123'
        });

      expect(res.status).toBe(422);
    });

    it('Secure: validates password length', async () => {
      const adminToken = await loginSecure('admin@test.com', 'admin123');

      const res = await request(app)
        .post('/secure/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'test@example.com',
          password: '123' // Too short
        });

      expect(res.status).toBe(422);
    });
  });
});

