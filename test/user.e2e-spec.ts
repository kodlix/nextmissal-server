import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Global validation pipe - same as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, 
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    // Get services
    jwtService = moduleFixture.get<JwtService>(JwtService);
    
    // Create a test access token
    accessToken = jwtService.sign({
      sub: '550e8400-e29b-41d4-a716-446655440000', // Test user ID
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['user:read']
    });
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/:id', () => {
    it('should get user profile when authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/users/550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('firstName');
          expect(res.body).toHaveProperty('lastName');
        });
    });

    it('should deny access when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/users/550e8400-e29b-41d4-a716-446655440000')
        .expect(401);
    });
  });

  describe('GET /users', () => {
    it('should get user list when authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('email');
          }
        });
    });

    it('should deny access when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });
  });
});