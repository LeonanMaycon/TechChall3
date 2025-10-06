import React from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  focused?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'default',
      focused = false,
      multiline = false,
      rows = 3,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    const inputClasses = cn(
      'w-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-neutral-400',
      
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-5 py-3 text-lg': size === 'lg',
      },
      
      hasLeftIcon && {
        'pl-10': size === 'sm',
        'pl-12': size === 'md',
        'pl-14': size === 'lg',
      },
      hasRightIcon && {
        'pr-10': size === 'sm',
        'pr-12': size === 'md',
        'pr-14': size === 'lg',
      },
      
      {
        'border border-neutral-300 rounded-md bg-white focus:border-primary-500 focus:ring-primary-500':
          variant === 'default' && !hasError,
        
        'border-0 rounded-md bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-primary-500':
          variant === 'filled' && !hasError,
        
        'border-2 border-neutral-300 rounded-md bg-transparent focus:border-primary-500 focus:ring-primary-500':
          variant === 'outlined' && !hasError,
      },
      
      hasError && {
        'border-error-500 focus:border-error-500 focus:ring-error-500': variant === 'default' || variant === 'outlined',
        'bg-error-50 focus:bg-white focus:ring-error-500': variant === 'filled',
      },
      
      focused && !hasError && 'ring-2 ring-primary-500',
      
      className
    );

    const labelClasses = cn(
      'block text-sm font-medium mb-1',
      hasError ? 'text-error-700' : 'text-secondary-700'
    );

    const helperTextClasses = cn(
      'mt-1 text-sm',
      hasError ? 'text-error-600' : 'text-secondary-500'
    );

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'absolute left-0 top-1/2 transform -translate-y-1/2 text-neutral-400',
                {
                  'left-3': size === 'sm',
                  'left-4': size === 'md',
                  'left-5': size === 'lg',
                }
              )}
            >
              {leftIcon}
            </div>
          )}
          
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              className={inputClasses}
              aria-invalid={hasError}
              aria-describedby={
                hasError
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              rows={rows}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              className={inputClasses}
              aria-invalid={hasError}
              aria-describedby={
                hasError
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              {...props}
            />
          )}
          
          {rightIcon && (
            <div
              className={cn(
                'absolute right-0 top-1/2 transform -translate-y-1/2 text-neutral-400',
                {
                  'right-3': size === 'sm',
                  'right-4': size === 'md',
                  'right-5': size === 'lg',
                }
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        
        {hasError && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !hasError && (
          <p id={`${inputId}-helper`} className={helperTextClasses}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
