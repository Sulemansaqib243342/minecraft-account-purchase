'use client';

import { Mail, MessageSquare } from 'lucide-react';

const DISCORD_URL = 'https://discord.gg/vGfFcjZPr';

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-4 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 items-start">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-display text-neon-green mb-3 text-glow-green">
              Gaming Zone Store
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your ultimate marketplace for premium gaming accounts, digital tools, subscriptions, VCCs & custom orders. Fast, affordable, and secure transactions via Email & Discord support.
            </p>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold font-display text-white mb-4">
              Support & Community
            </h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span className="text-white font-medium">Email Support:</span>{' '}
                <a href="mailto:zaydengrey172@gmail.com" className="text-neon-cyan hover:underline">
                  zaydengrey172@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-neon-purple flex-shrink-0" />
                <span className="text-white font-medium">Discord Server:</span>{' '}
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 transition-all text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Join Discord Server ↗
                </a>
              </p>
              <p className="text-xs text-gray-500 pt-1">
                Inquiries are responded to via email & Discord within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Divider & Disclaimer */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-gray-500 text-xs text-center leading-relaxed max-w-3xl mx-auto">
            © 2024 Gaming Zone Store. All rights reserved. This website
            is not affiliated with Mojang, Microsoft, Valve, or any game
            developer. All product names, logos, and brands are property of their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
