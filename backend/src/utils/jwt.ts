import * as jwt from 'jsonwebtoken';
import { IUser, JWTPayload } from '../types';

// Generate JWT token
export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin
  };

  const expiresIn = (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, process.env.JWT_SECRET || 'dreamfit-secret-key', {
    expiresIn
  });
};

// Generate refresh token (longer expiry)
export const generateRefreshToken = (user: IUser): string => {
  const payload: JWTPayload = {
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'dreamfit-secret-key', {
    expiresIn: '30d'
  });
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || 'dreamfit-secret-key') as JWTPayload;
};