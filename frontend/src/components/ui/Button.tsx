import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-elegant hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 border border-secondary-200 hover:border-secondary-300',
        outline:
          'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:text-primary-700 bg-white/80 backdrop-blur-sm',
        ghost:
          'text-primary-600 hover:bg-primary-50 hover:text-primary-700',
        link:
          'text-primary-600 underline-offset-4 hover:underline font-normal',
        gradient:
          'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 text-white shadow-glow hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]',
        elegant:
          'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 shadow-soft hover:shadow-elegant transform hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer effect for primary and gradient variants */}
        {(variant === 'primary' || variant === 'gradient') && !isDisabled && (
          <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* Left icon */}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center">
          {children}
        </span>

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };