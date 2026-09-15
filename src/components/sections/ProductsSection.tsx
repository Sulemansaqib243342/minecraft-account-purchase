'use client';

import { useState, useEffect } from 'react';
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
  Search,
  Info,
} from 'lucide-react';
import TiltCard from '../ui/TiltCard';
import { useCart } from '@/context/CartContext';
import NeonButton from '../ui/NeonButton';

import { createPortal } from 'react-dom';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  isCustomContact?: boolean;
  icon: any;
  color: string;
  description: string;
  category: 'Gaming Accounts' | 'Digital Tools' | 'Subscriptions & VCC';
  badge: string;
  specs: string[];
}

const products: ProductItem[] = [
  {
    id: 'xbox-gamepass',
    name: 'Xbox Game Pass Account',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: Crown,
    color: '#8B5CF6',
    description: 'Xbox Game Pass account access (No warranty on it)',
    category: 'Gaming Accounts',
    badge: '🔥 Popular',
    specs: ['PC & Console library access', 'Shared account credentials', 'Instant delivery via email', 'No warranty included'],
  },
  {
    id: 'steam-account',
    name: 'Steam Account',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: Gamepad2,
    color: '#39FF14',
    description: 'Steam account access (No warranty on it)',
    category: 'Gaming Accounts',
    badge: '⚡ Instant',
    specs: ['Steam login credentials', 'Pre-configured library access', 'Instant email delivery', 'No warranty included'],
  },
  {
    id: 'mcfna-account',
    name: 'MCFNA Account',
    price: 0.5,
    priceDisplay: '$0.50',
    icon: Box,
    color: '#06B6D4',
    description: 'Minecraft Full Access Account (Per piece)',
    category: 'Gaming Accounts',
    badge: '⚡ Instant',
    specs: ['Full Access Minecraft account', 'Email & password changeable', 'Per piece pricing', 'Instant delivery'],
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: Sparkles,
    color: '#5865F2',
    description: 'Discord Nitro boost & perks subscription',
    category: 'Subscriptions & VCC',
    badge: '🔥 Hot',
    specs: ['Server Boosts included', 'Custom emojis & HD streaming', 'Direct gift or code delivery', '24/7 activation support'],
  },
  {
    id: 'virtual-credit-card',
    name: 'Virtual Credit Card (VCC)',
    price: 2.0,
    priceDisplay: '$2.00',
    icon: CreditCard,
    color: '#10B981',
    description: 'VCC for online activations (Per piece)',
    category: 'Subscriptions & VCC',
    badge: '🛡️ Verified',
    specs: ['Online trial activations', 'Valid 16-digit card info', 'CVV & Expiry date included', 'Single-use balance card'],
  },
  {
    id: 'hotmail-checker',
    name: 'Hotmail Bulk Checker',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: ShieldCheck,
    color: '#0284C7',
    description: 'Bulk Hotmail account validator tool',
    category: 'Digital Tools',
    badge: '⚙️ Tool',
    specs: ['Bulk email validation tool', 'Fast multi-threaded checking', 'Export valid results instantly', 'Lifetime tool access'],
  },
  {
    id: 'hotmail-pass-changer',
    name: 'Hotmail Pass Changer',
    price: 12.0,
    priceDisplay: '$12.00',
    icon: KeyRound,
    color: '#EAB308',
    description: 'Automated Hotmail password changer tool',
    category: 'Digital Tools',
    badge: '⚡ Automated',
    specs: ['Automated password changer', 'Multi-account batch processing', 'Proxy support built-in', 'Full setup instructions'],
  },
  {
    id: 'netflix-1m',
    name: 'Netflix Account (1 Month)',
    price: 4.0,
    priceDisplay: '$4.00',
    icon: Tv,
    color: '#EF4444',
    description: '1 Month full subscription access',
    category: 'Subscriptions & VCC',
    badge: '📺 Stream',
    specs: ['1 Month Ultra HD access', 'Personal profile access', 'All devices supported', 'Fast replacement guarantee'],
  },
  {
    id: 'netflix-2m',
    name: 'Netflix Account (2 Months)',
    price: 8.0,
    priceDisplay: '$8.00',
    icon: Tv,
    color: '#F59E0B',
    description: '2 Months full subscription access',
    category: 'Subscriptions & VCC',
    badge: '📺 Stream',
    specs: ['2 Months 4K UHD streaming', 'Multi-screen support', 'Private credentials', 'Dedicated staff support'],
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
    category: 'Subscriptions & VCC',
    badge: '👑 Long-Term',
    specs: ['6 Months VIP subscription', 'Custom pricing quote', 'Priority support & replacement', 'Direct contact via Email/Discord'],
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll Account',
    price: 3.0,
    priceDisplay: '$3.00',
    icon: Film,
    color: '#F97316',
    description: 'Anime streaming premium account',
    category: 'Subscriptions & VCC',
    badge: '📺 Anime',
    specs: ['Ad-free anime streaming', 'Simulcast release access', 'Full HD 1080p quality', 'Instant delivery'],
  },
  {
    id: 'temp-email',
    name: 'Temporary Email',
    price: 0.3,
    priceDisplay: '$0.30',
    icon: Mail,
    color: '#A855F7',
    description: 'Disposable temp email per piece',
    category: 'Digital Tools',
    badge: '✉️ Temp',
    specs: ['Disposable email inbox', 'Verification code reception', 'Per piece pricing', 'Instant delivery'],
  },
];

export default function ProductsSection() {
  const { addItem } = useCart();

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);

  // Modal State
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('Custom Item / Unlisted Tool');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
    <>
      <section className="py-20 pt-28 px-4 relative z-10" id="products">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
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

          {/* Search & Category Filter Bar */}
          <div className="mb-12 space-y-6">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts, tools, subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-neon-cyan/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['All', 'Gaming Accounts', 'Digital Tools', 'Subscriptions & VCC'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                    selectedCategory === category
                      ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 shadow-neon-cyan/20 shadow-md scale-105'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {products.filter((p) => {
            const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesSearch =
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
          }).length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm glass rounded-2xl p-8 max-w-md mx-auto">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {products
                .filter((p) => {
                  const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
                  const matchesSearch =
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesCat && matchesSearch;
                })
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <TiltCard glowColor={product.color}>
                      <div className="glass rounded-2xl p-6 h-full border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                        <div>
                          {/* Header Badge & Icon */}
                          <div className="flex items-center justify-between mb-5">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${product.color}15` }}
                            >
                              <product.icon
                                className="w-6 h-6"
                                style={{ color: product.color }}
                              />
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-gray-300">
                              {product.badge}
                            </span>
                          </div>

                          {/* Product Info */}
                          <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-neon-cyan transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Specs Button */}
                          <button
                            onClick={() => setDetailProduct(product)}
                            className="text-[11px] text-neon-cyan hover:underline flex items-center gap-1 font-medium mb-4"
                          >
                            <Info className="w-3.5 h-3.5" />
                            View Specs & Details
                          </button>
                        </div>

                        <div>
                          {/* Price */}
                          <div className="mb-4">
                            <span
                              className="text-2xl font-bold font-display"
                              style={{ color: product.color }}
                            >
                              {product.priceDisplay}
                            </span>
                            {!product.isCustomContact && (
                              <span className="text-gray-500 text-xs ml-1">/ piece</span>
                            )}
                          </div>

                          {/* Action Button */}
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
          )}

          {/* Custom Banner Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 md:p-8 border border-neon-cyan/40 text-center max-w-3xl mx-auto space-y-3 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-green/10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              Custom Deals & Unlisted Items
            </div>
            <h3 className="text-xl md:text-3xl font-bold font-display text-white">
              ✨ Or You Can Make A Custom Order Too!
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
              Looking for a specific game account, unlisted tool, bulk package, or custom digital service? We fulfill custom requests fast!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleOpenModal('Custom Item / Unlisted Tool')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-cyan text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-cyan hover:opacity-90 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                DM Staff / Request Item
              </button>
              <a
                href="#custom"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neon-purple/50 bg-neon-purple/10 text-neon-purple font-bold text-xs uppercase tracking-wider hover:bg-neon-purple/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Custom Order Form
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Request Modal — Portaled to Viewport Screen Root */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 w-full max-w-lg glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden my-auto"
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

          {/* Product Specs Detail Modal */}
          {detailProduct && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDetailProduct(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 w-full max-w-lg glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden my-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${detailProduct.color}20` }}
                    >
                      <detailProduct.icon
                        className="w-6 h-6"
                        style={{ color: detailProduct.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold font-display text-white text-lg">
                        {detailProduct.name}
                      </h3>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {detailProduct.category} • {detailProduct.badge}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailProduct(null)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {detailProduct.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Features & Specifications
                    </h4>
                    <ul className="space-y-2.5">
                      {detailProduct.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-neon-green flex-shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span
                        className="text-xl font-bold font-display"
                        style={{ color: detailProduct.color }}
                      >
                        {detailProduct.priceDisplay}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const prodName = detailProduct.name;
                        setDetailProduct(null);
                        handleOpenModal(prodName);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neon-cyan text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-cyan hover:opacity-90"
                    >
                      Request Item Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
