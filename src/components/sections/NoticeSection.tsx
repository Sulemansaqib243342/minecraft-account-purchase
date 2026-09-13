'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function NoticeSection() {
  return (
    <section className="py-20 px-4 relative z-10" id="notice">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Pulsing warning border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-warning-amber via-warning-red to-warning-amber opacity-40 animate-glow-pulse" />

            <div className="relative glass rounded-2xl border border-warning-amber/30 shadow-warning p-8 md:p-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="p-2.5 rounded-xl bg-warning-amber/15 border border-warning-amber/20"
                >
                  <AlertTriangle className="w-7 h-7 text-warning-amber" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-warning-amber">
                  Important Information
                </h2>
              </div>

              {/* Warning Items */}
              <ul className="space-y-5">
                <li className="flex items-start gap-4 p-4 rounded-xl bg-warning-amber/5 border border-warning-amber/10">
                  <span className="text-xl mt-0.5">⚠️</span>
                  <span className="text-gray-300 leading-relaxed">
                    If you need{' '}
                    <strong className="text-white">
                      password change method
                    </strong>{' '}
                    or additional account details, it will be provided{' '}
                    <strong className="text-white">separately</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-warning-red/5 border border-warning-red/10">
                  <span className="text-xl mt-0.5">⚠️</span>
                  <span className="text-gray-300 leading-relaxed">
                    We{' '}
                    <strong className="text-warning-red">
                      do NOT guarantee
                    </strong>{' '}
                    how long the account will work after purchase.
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-warning-amber/5 border border-warning-amber/10">
                  <span className="text-xl mt-0.5">⚠️</span>
                  <span className="text-gray-300 leading-relaxed">
                    Purchase is at your own risk. Please read our terms before
                    proceeding with any purchase.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
