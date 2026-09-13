'use client';

import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'green' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  green: {
    border: 'border-neon-green/50',
    text: 'text-neon-green',
    shadow: 'shadow-neon-green',
    hoverBg: 'hover:bg-neon-green/10',
    gradient: 'from-neon-green/20 to-transparent',
  },
  purple: {
    border: 'border-neon-purple/50',
    text: 'text-neon-purple',
    shadow: 'shadow-neon-purple',
    hoverBg: 'hover:bg-neon-purple/10',
    gradient: 'from-neon-purple/20 to-transparent',
  },
  cyan: {
    border: 'border-neon-cyan/50',
    text: 'text-neon-cyan',
    shadow: 'shadow-neon-cyan',
    hoverBg: 'hover:bg-neon-cyan/10',
    gradient: 'from-neon-cyan/20 to-transparent',
  },
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function NeonButton({
  children,
  variant = 'green',
  size = 'md',
  onClick,
  className = '',
}: NeonButtonProps) {
  const v = variantStyles[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border ${v.border} ${v.text}
        ${sizeStyles[size]} font-semibold font-display tracking-wider uppercase
        bg-gradient-to-b ${v.gradient} backdrop-blur-sm
        ${v.hoverBg} transition-all duration-300
        ${v.shadow} hover:shadow-lg
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
