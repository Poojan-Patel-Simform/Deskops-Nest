import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(
    z.object({ name: z.string().min(1), seats: z.coerce.number().int().positive() }),
  );

  it('returns the parsed value, applying coercion', () => {
    expect(pipe.transform({ name: 'HQ', seats: '4' })).toEqual({ name: 'HQ', seats: 4 });
  });

  it('throws a 400 listing every issue with its path', () => {
    try {
      pipe.transform({ name: '', seats: -1 });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const message = (error as BadRequestException).getResponse() as { message: string[] };
      expect(message.message).toHaveLength(2);
      expect(message.message[0]).toMatch(/^name: /);
      expect(message.message[1]).toMatch(/^seats: /);
    }
  });

  it('rejects a missing body', () => {
    expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
  });
});
