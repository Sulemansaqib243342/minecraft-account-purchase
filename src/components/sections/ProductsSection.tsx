'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Crown,
  Box,
  Tv,
  Film,
  Mail,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import TiltCard from '../ui/TiltCard';
import { useCart } from '@/context/CartContext';
import NeonButton from '../ui/NeonButton';

const products = [
  {
    id: 'xbox-gamepass',
    name: 'Xbox Game Pass Account',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: Crown,
    color: '#8B5CF6',
    description: 'Xbox Game Pass account (No warranty on it)',
  },
  {
    id: 'steam-account',
    name: 'Steam Account',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: Gamepad2,
    color: '#39FF14',
    description: 'Steam account access (No warranty on it)',
  },
  {
    id: 'mcfna-account',
    name: 'MCFNA Account',
    price: 0.5,
    priceDisplay: '$0.50',
    icon: Box,
    color: '#06B6D4',
    description: 'Minecraft Full Access Account (Per piece)',
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: Sparkles,
    color: '#5865F2',
    description: 'Discord Nitro boost & perks subscription',
  },
  {
    id: 'virtual-credit-card',
    name: 'Virtual Credit Card (VCC)',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: CreditCard,
    color: '#10B981',
    description: 'VCC for online activations (Per piece)',
  },
  {
    id: 'hotmail-checker',
    name: 'Hotmail Bulk Checker',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: ShieldCheck,
    color: '#0284C7',
    description: 'Bulk Hotmail account validator tool',
  },
  {
    id: 'hotmail-pass-changer',
    name: 'Hotmail Pass Changer',
    price: 12.0,
    priceDisplay: '$12.00',
    icon: KeyRound,
    color: '#EAB308',
    description: 'Automated Hotmail password changer tool',
  },
  {
    id: 'netflix-1m',
    name: 'Netflix Account (1 Month)',
    price: 4.0,
    priceDisplay: '$4.00',
    icon: Tv,
    color: '#EF4444',
    description: '1 Month full subscription access',
  },
  {
    id: 'netflix-2m',
    name: 'Netflix Account (2 Months)',
    price: 8.0,
    priceDisplay: '$8.00',
    icon: Tv,
    color: '#F59E0B',
    description: '2 Months full subscription access',
  },
  {
    id: 'netflix-6m',
    name: 'Netflix Account (6 Months)',
    price: 0,
    priceDisplay: 'Contact Staff',
    isCustomContact: true,
    icon: Tv,
    color: '#EC4899',
    description: '6 Months long-term subscription',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll Account',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: Film,
    color: '#F97316',
    description: 'Anime streaming premium account',
  },
  {
    id: 'temp-email',
    name: 'Temporary Email',
    price: 0.3,
    priceDisplay: '$0.30',
    icon: Mail,
    color: '#A855F7',
    description: 'Disposable temp email per piece',
  },
];

export default function ProductsSection() {
  const { addItem } = useCart();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('Custom Item / Unlisted Tool');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenModal = (productTitle?: string) => {
    setSelectedProduct(productTitle || 'Custom Item / Unlisted Tool');
    setMessage(productTitle ? `Hi! I would like to inquire about ${productTitle}.` : '');
    setSubmitted(false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `Request: ${selectedProduct}`,
          message,
          product: selectedProduct,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Submission failed.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 pt-28 px-4 relative z-10" id="products">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-xs font-semibold uppercase tracking-wider mb-4">
            Our Digital Catalog & Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Accounts, Tools & Services
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Affordable prices & instant delivery on gaming accounts, VCCs, tools & subscriptions
          </p>
        </motion.div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <TiltCard glowColor={product.color}>
                <div className="glass rounded-2xl p-6 h-full border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${product.color}15` }}
                    >
                      <product.icon
                        className="w-7 h-7"
                        style={{ color: product.color }}
                      />
                    </div>

                    {/* Product Info */}
                    <h3 className="text-lg font-bold font-display text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    {/* Price */}
                    <div className="mb-5">
                      <span
                        className="text-2xl md:text-3xl font-bold font-display"
                        style={{ color: product.color }}
                      >
                        {product.priceDisplay}
                      </span>
                      {!product.isCustomContact && (
                        <span className="text-gray-500 text-xs ml-1">/ piece</span>
                      )}
                    </div>

                    {/* Button */}
                    {product.isCustomContact ? (
                      <button
                        onClick={() => handleOpenModal(product.name)}
                        className="w-full py-2.5 rounded-xl border font-semibold font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-125"
                        style={{
                          borderColor: `${product.color}50`,
                          color: product.color,
                          backgroundColor: `${product.color}10`,
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Contact Staff
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            color: product.color,
                          })
                        }
                        className="w-full py-2.5 rounded-xl border font-semibold font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
                        style={{
                          borderColor: `${product.color}50`,
                          color: product.color,
                          backgroundColor: `${product.color}10`,
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Custom Banner Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 md:p-8 border border-neon-cyan/30 text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            Looking for something else?
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-display text-white">
            And Many More Products Available!
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
            If you need any custom items, unlisted software, or bulk deals, just join our <a href="https://discord.gg/vGfFcjZPr" target="_blank" rel="noopener noreferrer" className="text-neon-purple font-semibold hover:underline">Discord Server ↗</a> or send an Email Inquiry!
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenModal('Custom Item / Unlisted Tool')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-cyan text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-cyan hover:opacity-90 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              DM Staff / Request Item
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-white text-lg">
                      DM Staff / Request Item
                    </h3>
                    <p className="text-xs text-neon-cyan font-medium">
                      Item: {selectedProduct}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold font-display text-white">
                    Request Sent to Staff!
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed max-w-sm mx-auto">
                    We have received your email request. Our team will review it and reply directly to your email address shortly.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-neon-green text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-green"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-warning-red/10 border border-warning-red/30 text-warning-red text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-cyan/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-cyan/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Request Details / Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what account, tool, or custom service you are looking for..."
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-cyan/50"
                    />
                  </div>

                  <div className="pt-2">
                    <NeonButton
                      variant="cyan"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Email Request...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Request Email
                        </>
                      )}
                    </NeonButton>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
