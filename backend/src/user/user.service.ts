import {prisma} from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterPayload, LoginPayload, UserData } from './user.interface';
import { Role, ApprovalStatus } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'your-bucket-name'; // Replace with your bucket name

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
  }});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function registerUser(payload: RegisterPayload): Promise<{ userData: UserData; token: string }> {
  const { email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role,
      assignedRole: Role.USER, // Default assigned role
      kycStatus: ApprovalStatus.PENDING, // Default KYC status
    },
    select: {
      id: true,
      email: true,
      assignedRole: true,
      role: true,
      kycStatus: true,
    },
  });

  const userData: UserData = {
    id: newUser.id,
    email: newUser.email,
    assignedRole: newUser.assignedRole,
    role: newUser.role,
    kycStatus: newUser.kycStatus,
  };

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration as needed

  return { userData, token };
}

async function loginUser(payload: LoginPayload): Promise<{ userData: UserData; token: string } | null> {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
   throw new Error("User/Password is incorrect");
  }
  const userData: UserData = {
    id: user.id,
    email: user.email,
    assignedRole: user.assignedRole,
    role: user.role,
    kycStatus: user.kycStatus,
  };

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  return { userData, token };
}

async function getUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

async function getUploadUrl(userId: string, fileName: string) {
  const filePath = `images/${userId}/${fileName}`;
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).createSignedUploadUrl(filePath);

  if (error) {
    console.error('Error getting signed URL:', error);
    throw new Error('Failed to get signed URL from Supabase');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { fileSource: filePath },
  });

  return { signedUrl: data.signedUrl, path: filePath };
}

export default { registerUser, loginUser, getUserById,getUploadUrl };