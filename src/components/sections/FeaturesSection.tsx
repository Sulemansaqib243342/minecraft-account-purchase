'use client';

import { motion } from 'framer-motion';
import { Zap, DollarSign, Headphones, ShoppingCart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Delivery',
    emoji: '⚡',
    color: '#39FF14',
    description: 'Get your account details within minutes of purchase',
  },
  {
    icon: DollarSign,
    title: 'Affordable Prices',
    emoji: '💰',
    color: '#8B5CF6',
    description: 'Best prices in the market for premium accounts',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    emoji: '🎧',
    color: '#06B6D4',
    description: 'Round-the-clock customer support for any issues',
  },
  {
    icon: ShoppingCart,
    title: 'Easy Purchase',
    emoji: '🛒',
    color: '#F59E0B',
    description: 'Simple and secure checkout process',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative z-10" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-xs font-semibold uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display">
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              Our Features
            </span>
          </h2>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-colors duration-300 h-full group cursor-default"
              >
                {/* Icon Container */}
                <div
                  className="w-16 h-16 mx-auto mb-5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="w-8 h-8"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Emoji */}
                <div className="text-3xl mb-3">{feature.emoji}</div>

                {/* Title */}
                <h3 className="text-lg font-semibold font-display text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
