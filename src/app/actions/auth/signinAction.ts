'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma/prisma';
import { loginSchema } from '@/lib/validators/auth';
import { SafeUser, SigninActionState } from '@/lib/types/auth';

export async function signinAction(
  prevState: SigninActionState | null,
  formData: FormData,
): Promise<SigninActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  // Validate inputs
  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    const { fieldErrors } = validation.error.flatten();
    return { fieldErrors };
  }

  const validatedData = validation.data;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user || !user.password) {
    return { generalError: 'Invalid email or password' };
  }

  // Compare password
  const isMatch = await bcrypt.compare(validatedData.password, user.password);

  if (!isMatch) {
    return { generalError: 'Invalid email or password' };
  }

  // Return safe user fields
  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  return { success: true, user: safeUser };
}
