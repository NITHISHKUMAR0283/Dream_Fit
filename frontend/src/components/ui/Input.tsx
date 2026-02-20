import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white/50 backdrop-blur-sm text-neutral-900 transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-neutral-200 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-100 hover:border-neutral-300',
        elegant:
          'border-secondary-200 bg-secondary-50/50 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:bg-white hover:border-secondary-300',
        search:
          'border-neutral-200 bg-neutral-50/50 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:bg-white pl-10',
        error:
          'border-red-300 bg-red-50/30 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-100 text-red-900 placeholder:text-red-400',
        success:
          'border-green-300 bg-green-50/30 focus-visible:border-green-400 focus-visible:ring-2 focus-visible:ring-green-100',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-14 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    type,
    label,
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    isPassword = false,
    showPasswordToggle = true,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasError = !!error;
    const hasSuccess = !!success;
    const finalVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {props.required && (
              <span className="text-primary-500 ml-1">*</span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          {/* Search Icon for search variant */}
          {variant === 'search' && !leftIcon && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          )}

          {/* Input */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: finalVariant, size }),
              leftIcon && 'pl-10',
              (variant === 'search' && !leftIcon) && 'pl-10',
              (rightIcon || isPassword || hasError || hasSuccess) && 'pr-10',
              isFocused && 'shadow-soft',
              className
            )}
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Success Icon */}
            {hasSuccess && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}

            {/* Error Icon */}
            {hasError && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isPassword && !hasError && !hasSuccess && (
              <span className="text-neutral-400">
                {rightIcon}
              </span>
            )}

            {/* Password Toggle */}
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Focus ring animation */}
          {isFocused && (
            <div className="absolute inset-0 rounded-xl border-2 border-primary-400 opacity-20 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Helper Text */}
        <div className="min-h-[1.25rem]">
          {error && (
            <p className="text-sm text-red-600 flex items-center space-x-1 animate-slide-up">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {success && !error && (
            <p className="text-sm text-green-600 flex items-center space-x-1 animate-slide-up">
              <CheckCircle className="w-3 h-3 flex-shrink-0" />
              <span>{success}</span>
            </p>
          )}

          {hint && !error && !success && (
            <p className="text-sm text-neutral-500">{hint}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };