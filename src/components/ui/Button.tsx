import React from 'react';
import Link from 'next/link';

type BaseProps = {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = (props) => {
  const variantClass = (props.variant ?? 'primary') === 'primary' ? 'btn-primary' : 'btn-secondary';

  if (props.as === 'a') {
    const { as: _as, variant: _variant, isLoading: _isLoading, className = '', children, href, ...rest } = props;
    return (
      <Link href={href} className={`${variantClass} ${className} inline-block text-center`} {...rest}>
        {children}
      </Link>
    );
  }

  const { as: _as, href: _href, variant: _variant, isLoading, disabled, className = '', children, ...rest } = props;

  return (
    <button
      className={`${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
