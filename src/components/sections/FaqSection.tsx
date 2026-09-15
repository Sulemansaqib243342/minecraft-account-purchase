'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, MessageSquare, CreditCard } from 'lucide-react';

const faqs = [
  {
    icon: Zap,
    question: 'How fast will I receive my order after requesting?',
    answer:
      'Inquiries and orders are processed rapidly by our support staff! Most requests are fulfilled within 10 to 30 minutes during active hours, and under 24 hours guaranteed for all email & Discord inquiries.',
  },
  {
    icon: ShieldCheck,
    question: 'Are accounts and tools covered under warranty?',
    answer:
      'Each product listing states its specific warranty policy. MCFNA Minecraft accounts, Netflix, and VCCs come with replacement guarantees. Specific budget accounts like Xbox Game Pass or Steam access are provided as-is without extra warranty.',
  },
  {
    icon: CreditCard,
    question: 'What payment methods do you accept?',
    answer:
      'We accept Crypto, Virtual Cards, Local Wallet transfers, and custom payment options via Staff DM. Once you submit an inquiry or custom request, staff will provide precise payment instructions.',
  },
  {
    icon: MessageSquare,
    question: 'Can I make a custom order for unlisted tools or bulk accounts?',
    answer:
      'Yes! We specialize in custom requests. Click "Make Custom Order" or "DM Staff", describe what account, tool, or volume package you need, and our team will provide custom pricing.',
  },
  {
    icon: HelpCircle,
    question: 'How will staff contact me after I submit a request?',
    answer:
      'Our support staff receives your request instantly and sends a direct response to your provided email address. You can also join our Discord Server to chat with staff directly!',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 relative z-10" id="faq">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            Help & Knowledge Base
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Everything you need to know about deliveries, custom orders, payments & support
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="glass rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold font-display text-white text-base md:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-neon-cyan' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-300 text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
