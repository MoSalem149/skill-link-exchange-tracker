import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  skillToTeach: z.string().min(1, "Skill to teach is required"),
  skillToLearn: z.string().min(1, "Skill to learn is required")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const validateSignup = (data: unknown) => {
  try {
    const result = signupSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
};

export const validateLogin = (data: unknown) => {
  try {
    const result = loginSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
};
