'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Loader2, AlertCircle, Send } from 'lucide-react';
import NeonButton from '../ui/NeonButton';

export default function CustomPurchaseSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'Custom Purchase Request',
          message,
          product: 'Custom Request',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 relative z-10" id="custom">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple opacity-30" />

            <div className="relative glass-strong rounded-3xl p-8 md:p-12 text-center">
              {/* Badge */}
              <div className="inline-block px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-6">
                Custom Orders & Inquiries
              </div>

              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  Get In Touch
                </span>
              </h2>

              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                👉 Need a custom Game Pass, Steam, or Minecraft account deal? Fill in your details below and our support team will email you back!
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-neon-green/10 border border-neon-green/30 text-center space-y-4 max-w-lg mx-auto"
                >
                  <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto" />
                  <h3 className="text-xl font-bold font-display text-white">Inquiry Sent Successfully!</h3>
                  <p className="text-gray-300 text-sm">
                    We have received your message. Our team will review your request and reply to your email address shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-neon-green text-dark-900 font-bold text-xs uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 text-left">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-warning-red/10 border border-warning-red/30 text-warning-red text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Request Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what account or package you are looking for..."
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                    />
                  </div>

                  <NeonButton
                    variant="cyan"
                    size="md"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Email Inquiry
                      </>
                    )}
                  </NeonButton>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
