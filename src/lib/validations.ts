import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  ...loginSchema.shape,
})

export const passwordSetSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const phoneNumberRegex = /^\+[1-9]\d{10,14}$/
export const AccountEditSchema = z
  .object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email(),
    phone: z.string().regex(phoneNumberRegex).optional(),
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  })
  .refine(({ newPassword, confirmPassword }) =>
    newPassword === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(({ currentPassword, newPassword }) =>
    currentPassword !== newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
