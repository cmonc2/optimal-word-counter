import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { FindOrCreateFile } from '../utils/helpers.js';
import App from '../app.js';

const dummyFile: any = { path: './src/__tests__/dummy.txt', options: { count: 100000, size: null } };
const image: any = { path: './src/__tests__/image.jpg', options: { count: null, size: null } };

beforeAll(async () => {
  await FindOrCreateFile(dummyFile.path, dummyFile.options);
  await FindOrCreateFile(image.path, image.options);
});

describe('POST /upload', () => {
  it('should upload the text file and return expected JSON', () => {
    return request(App)
      .post('/api/v1/upload/10')
      .attach('file', dummyFile.path)
      .expect(200)
      .then((res: any) => {
        expect(res.body.frecuencies).toHaveLength(10);
        expect(res.body.frecuencies[0]).toHaveProperty('word');
        expect(res.body.frecuencies[0]).toHaveProperty('count');
        
        // Assert descending order of frequencies
        for (let i = 0; i < res.body.frecuencies.length - 1; i++) {
          expect(res.body.frecuencies[i].count).toBeGreaterThanOrEqual(res.body.frecuencies[i + 1].count);
        }
      });
  });

  it('should returns error 500 file not supported', () => {
    return request(App)
      .post('/api/v1/upload/10')
      .attach('file', image.path)
      .expect(500)
      .then((res: any) => {
        expect(res.body).toEqual({ message: 'File not supported' });
      });
  });

  it('should returns error 500 (file is missing)', () => {
    return request(App)
      .post('/api/v1/upload/10')
      .expect(500)
      .then((res: any) => {
        expect(res.body).toEqual({ message: 'File is missing' });
      });
  });

  it('should serve the React client HTML interface or 404 in pure API mode', () => {
    return request(App)
      .get('/')
      .expect((res: any) => {
        expect([200, 404]).toContain(res.status);
      });
  });
});