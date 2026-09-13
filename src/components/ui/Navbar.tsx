'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-bold font-display text-neon-green text-glow-green tracking-wide flex items-center gap-2"
        >
          <span>MC Accounts</span>
        </Link>

        {/* Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#products" className="hover:text-white transition-colors">
            Products
          </a>
          <a href="#custom" className="hover:text-white transition-colors">
            Contact & Custom Order
          </a>
          <a href="#notice" className="hover:text-white transition-colors">
            Notice
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 rounded-lg border border-neon-purple/30 bg-neon-purple/10 flex items-center justify-center text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neon-green text-dark-900 text-xs font-bold flex items-center justify-center shadow-neon-green"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
