'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';
import { registerSchema } from '@/lib/validators/auth';
import { AuthActionState } from '@/lib/types/auth';

export async function signupAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const username = formData.get('username');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Validate form inputs
  const validation = registerSchema.safeParse({
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword,
  });

  if (!validation.success) {
    const { fieldErrors } = validation.error.flatten();
    return { fieldErrors };
  }

  const validatedData = validation.data;

  // Check if user/email exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: validatedData.email }, { username: validatedData.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === validatedData.email) {
      return { generalError: 'User with this email already exists' };
    }
    return { generalError: 'Username already taken' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 12);

  // Create user using Prisma type
  await prisma.user.create({
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      role: 'user',
    } as Prisma.UserUncheckedCreateInput,
  });

  return { success: true };
}
