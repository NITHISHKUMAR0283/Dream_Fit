import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { AuthRequest, JWTPayload, ApiResponse } from '../types';

// Protect routes - require authentication
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      } as ApiResponse);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      // Get user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, is_admin, created_at, updated_at')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        } as ApiResponse);
      }

      // Attach user to request object
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    } as ApiResponse);
  }
};

// Admin middleware - require admin privileges
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    } as ApiResponse);
  }
};

// Optional auth - attach user if token is valid, but don't require it
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        const { data: user, error } = await supabase
          .from('users')
          .select('id, name, email, is_admin, created_at, updated_at')
          .eq('id', decoded.id)
          .single();

        if (!error && user) {
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.is_admin,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          };
        }
      } catch (error) {
        // Invalid token, but we don't throw an error since auth is optional
        console.log('Optional auth: Invalid token');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Aliases for consistency with route naming
export const authenticate = protect;
export const requireAdmin = admin;