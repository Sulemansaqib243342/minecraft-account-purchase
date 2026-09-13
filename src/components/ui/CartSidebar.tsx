'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg('Please enter your name and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Format cart summary
    const cartSummary = items
      .map((item) => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const fullMessage = `Order Inquiry:\n\n${cartSummary}\n\nTotal Price: $${totalPrice.toFixed(2)}`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          subject: `Order Inquiry - $${totalPrice.toFixed(2)}`,
          message: fullMessage,
          product: items.map((i) => i.name).join(', '),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please try again.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCustomerName('');
    setCustomerEmail('');
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-dark-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold font-display text-white">
                🛒 Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items / Submitted Confirmation */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">Order Submitted!</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Thank you! We have received your order inquiry and will respond to your email shortly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-neon-green text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-green"
                  >
                    Close
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg mb-1">Cart is empty</p>
                  <p className="text-gray-600 text-sm">
                    Add some gaming accounts to get started!
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="glass rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {item.name}
                        </h3>
                        <p
                          className="text-sm font-medium"
                          style={{ color: item.color }}
                        >
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-warning-red transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-semibold text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-bold text-white text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer — Email Checkout Form */}
            {items.length > 0 && !submitted && (
              <form onSubmit={handleCheckout} className="p-6 border-t border-white/10 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-warning-red/10 border border-warning-red/30 text-warning-red text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium text-sm">Total Amount</span>
                  <span className="text-2xl font-bold font-display text-neon-green text-glow-green">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-purple/50"
                  />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-purple/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Order...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Order via Email
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-xs text-gray-500 hover:text-warning-red transition-colors py-1"
                >
                  Clear Cart
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
