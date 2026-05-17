import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  active?: boolean
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-primary text-white hover:bg-accent-primary-hover focus:ring-2 focus:ring-accent-primary/50 disabled:bg-surface-2 disabled:text-text-disabled',
  secondary: 'bg-surface-2 text-text-primary border border-border-default hover:bg-surface-3 hover:border-border-strong focus:ring-2 focus:ring-accent-primary/50 disabled:bg-surface-1 disabled:text-text-disabled disabled:border-border-subtle',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary focus:ring-2 focus:ring-accent-primary/50 disabled:text-text-disabled',
  danger: 'bg-accent-danger text-white hover:bg-red-600 focus:ring-2 focus:ring-accent-danger/50 disabled:bg-surface-2 disabled:text-text-disabled'
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2'
}

export function AppButton({
  variant = 'ghost',
  size = 'md',
  active,
  className = '',
  type = 'button',
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:cursor-not-allowed',
        // Variant styles
        buttonVariants[variant],
        // Size styles
        buttonSizes[size],
        // Active state
        active && variant === 'ghost' && 'bg-surface-2 text-text-primary',
        active && variant === 'secondary' && 'bg-surface-3 border-border-strong',
        className,
      )}
      {...props}
    />
  )
}
