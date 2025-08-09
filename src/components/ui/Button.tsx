import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-[#C8A951] text-white hover:bg-[#B8992E] focus:ring-[#C8A951] shadow-lg hover:shadow-xl',
    secondary: 'bg-[#1A1D23] text-white hover:bg-[#2A2D33] focus:ring-[#1A1D23]',
    outline: 'border-2 border-[#C8A951] text-[#C8A951] hover:bg-[#C8A951] hover:text-white',
    ghost: 'text-[#1A1D23] hover:bg-gray-100'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && disabledClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}