import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className={cn(
        'bg-white rounded-lg shadow-md border border-gray-100',
        hover && 'cursor-pointer transition-shadow duration-200 hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  )
}