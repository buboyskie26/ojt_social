import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(2, '* Post Title is required field.').max(255),
  content: z.string().min(2, '* Post Content is required field.').max(65535),
});

export const registerSchemaValidation = z.object({
  email: z.string().email('Invalid email format.').min(1, 'Email is required.'),
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters long.')
    .max(50),
});
