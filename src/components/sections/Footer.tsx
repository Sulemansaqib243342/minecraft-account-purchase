'use client';

import { motion } from 'framer-motion';
import { Mail, Twitter, Instagram, Youtube, Github, MessageSquare } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-display text-neon-green mb-3 text-glow-green">
              Minecraft Account Purchase
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for premium gaming accounts. Fast, affordable,
              and secure transactions via email & Discord support.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold font-display text-white mb-4">
              Support Info
            </h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span className="text-white font-medium">Email:</span>{' '}
                <a href="mailto:zaydengrey172@gmail.com" className="text-neon-cyan hover:underline">
                  zaydengrey172@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-neon-purple flex-shrink-0" />
                <span className="text-white font-medium">Discord:</span>{' '}
                <span className="text-neon-purple font-semibold">haseebtw.</span>
              </p>
              <p className="text-xs text-gray-500 pt-1">
                Inquiries are responded to via email within 24 hours.
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold font-display text-white mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    social.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-green hover:border-neon-green/30 hover:shadow-neon-green transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Disclaimer */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-gray-500 text-xs text-center leading-relaxed max-w-3xl mx-auto">
            © 2024 Minecraft Account Purchase. All rights reserved. This website
            is not affiliated with Mojang, Microsoft, Valve, or any game
            developer. All product names, logos, and brands are property of their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
