import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-[#7f21f6] text-white hover:bg-[#6a1bd4] shadow-sm hover:shadow-md',
  secondary: 'bg-white text-gray-800 border border-gray-200 hover:border-[#7f21f6] hover:text-[#7f21f6]',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost: 'text-gray-500 hover:text-[#7f21f6] hover:bg-[#f3ecfe]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-[15px]',
}

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium tracking-[-0.01em] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
