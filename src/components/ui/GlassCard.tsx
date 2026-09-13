interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'green' | 'purple' | 'cyan' | 'warning' | 'none';
}

const glowStyles = {
  green: 'border-neon-green/20 shadow-neon-green',
  purple: 'border-neon-purple/20 shadow-neon-purple',
  cyan: 'border-neon-cyan/20 shadow-neon-cyan',
  warning: 'border-warning-amber/30 shadow-warning',
  none: 'border-white/10',
};

export default function GlassCard({
  children,
  className = '',
  glowColor = 'none',
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl border ${glowStyles[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
}
