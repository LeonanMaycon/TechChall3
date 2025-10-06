import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  hover?: boolean;
  focused?: boolean;
  loading?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      padding = 'md',
      clickable = false,
      hover = false,
      focused = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const cardClasses = cn(
      'relative overflow-hidden transition-all duration-200',
      'focus:outline-none',
      
      clickable && [
        'cursor-pointer select-none',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      ],
      
      hover && 'hover:shadow-lg hover:-translate-y-1',
      
      focused && 'ring-2 ring-primary-500 ring-offset-2',
      
      loading && 'opacity-75 pointer-events-none',
      
      {
        'rounded-lg': size === 'sm',
        'rounded-xl': size === 'md',
        'rounded-2xl': size === 'lg',
      },
      
      {
        'p-0': padding === 'none',
        'p-3': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg',
      },
      
      {
        'bg-white border border-neutral-200 shadow-sm':
          variant === 'default',
        
        'bg-white shadow-lg border-0':
          variant === 'elevated',
        
        'bg-white border-2 border-neutral-300 shadow-none':
          variant === 'outlined',
        
        'bg-neutral-50 border border-neutral-200 shadow-none':
          variant === 'filled',
      },
      
      className
    );

    return (
      <div
        ref={ref}
        className={cardClasses}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        )}
        
        {children}
      </div>
    );
  }
);

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between mb-4',
          'border-b border-neutral-200 pb-4',
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary-600">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          !noPadding && 'px-6 py-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center mt-4 pt-4 border-t border-neutral-200',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
