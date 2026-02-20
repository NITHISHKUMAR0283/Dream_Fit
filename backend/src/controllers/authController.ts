import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { isValidEmail, isStrongPassword, sanitizeString } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';
import { OAuth2Client } from 'google-auth-library';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      } as ApiResponse);
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      } as ApiResponse);
    }

    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      } as ApiResponse);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      } as ApiResponse);
    }

    // Create user
    const user = await User.create({
      name: sanitizeString(name),
      email: email.toLowerCase(),
      password,
      phone: phone || undefined
    });

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified
        },
        token
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    } as ApiResponse);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      } as ApiResponse);
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      } as ApiResponse);
    }

    // Check for user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified
        },
        token
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    } as ApiResponse);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: user!._id,
          name: user!.name,
          email: user!.email,
          phone: user!.phone,
          address: user!.address,
          isAdmin: user!.isAdmin,
          isVerified: user!.isVerified,
          createdAt: user!.createdAt
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile'
    } as ApiResponse);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const user = req.user!;

    // Update fields if provided
    if (name) {
      user.name = sanitizeString(name);
    }

    if (phone) {
      user.phone = phone;
    }

    if (address) {
      user.address = address;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified
        }
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    } as ApiResponse);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
    }

    // Validate current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      } as ApiResponse);
    }

    // Validate new password
    const passwordValidation = isStrongPassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      } as ApiResponse);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    } as ApiResponse);
  } catch (error: any) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error changing password'
    } as ApiResponse);
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential, isAdmin } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      } as ApiResponse);
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      } as ApiResponse);
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Required user information not available from Google'
      } as ApiResponse);
    }

    // Define admin email - only this email gets admin access
    const ADMIN_EMAIL = 'nk0283@srmist.edu.in';
    const userIsAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update user's Google info if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture;
      }
      // Set admin status based on email
      user.isAdmin = userIsAdmin;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: sanitizeString(name),
        email: email.toLowerCase(),
        googleId,
        picture,
        isVerified: true, // Google accounts are considered verified
        isAdmin: userIsAdmin, // Set admin status based on email
        password: undefined // No password for Google users
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          wishlist: user.wishlist || [],
          addresses: user.addresses || []
        },
        token
      }
    } as ApiResponse);
  } catch (error: any) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    } as ApiResponse);
  }
};

// @desc    Direct login (for development)
// @route   POST /api/auth/direct-login
// @access  Public
export const directLogin = async (req: Request, res: Response) => {
  try {
    const { type } = req.body; // 'admin' or 'customer'

    // Create or find a demo user
    const email = type === 'admin' ? 'admin@dreamfit.com' : 'customer@dreamfit.com';
    const name = type === 'admin' ? 'Admin User' : 'Customer User';
    const isAdmin = type === 'admin';

    let user = await User.findOne({ email });

    if (!user) {
      // Create demo user
      user = await User.create({
        name,
        email,
        isAdmin,
        isVerified: true,
        password: undefined // No password needed for demo
      });
    } else {
      // Update admin status
      user.isAdmin = isAdmin;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `${type} login successful`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          wishlist: user.wishlist || [],
          addresses: user.addresses || []
        },
        token
      }
    } as ApiResponse);

  } catch (error: any) {
    console.error('Direct login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    } as ApiResponse);
  }
};