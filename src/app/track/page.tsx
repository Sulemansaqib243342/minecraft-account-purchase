'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, PackageCheck, Clock, CheckCircle2, MessageSquare, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchTrackStatus = async (searchStr: string) => {
    if (!searchStr.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setInquiries(data.inquiries || []);
      } else {
        setErrorMsg(data.error || 'Failed to search order status.');
        setInquiries([]);
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTrackStatus(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackStatus(query);
  };

  return (
    <div className="min-h-screen py-24 px-4 relative z-10 max-w-4xl mx-auto">
      {/* Header Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gaming Zone Store
        </Link>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl text-center mb-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mx-auto mb-6">
          <PackageCheck className="w-8 h-8" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
          Track Your Order & Inquiry
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
          Enter your <span className="text-neon-cyan font-semibold">Inquiry ID</span> or <span className="text-neon-cyan font-semibold">Email Address</span> below to view real-time status and staff replies.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Inquiry ID (e.g. 5) or Email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-cyan/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-neon-cyan text-dark-900 font-bold text-xs uppercase tracking-wider shadow-neon-cyan flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Status'}
          </button>
        </form>
      </motion.div>

      {/* Results Section */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-warning-red/10 border border-warning-red/30 text-warning-red text-xs flex items-center gap-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {searched && !loading && inquiries.length === 0 && !errorMsg && (
        <div className="glass rounded-3xl p-8 text-center text-gray-400 text-sm border border-white/10">
          No inquiries found matching &quot;{query}&quot;. Please verify your email or Inquiry ID.
        </div>
      )}

      {inquiries.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-display text-white">
            Matching Inquiries ({inquiries.length})
          </h2>

          {inquiries.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6"
            >
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">
                    Inquiry #{item.id} • {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg font-bold font-display text-white mt-1">
                    {item.product || item.subject || 'Custom Order Inquiry'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'replied' && (
                    <span className="px-3 py-1 rounded-full bg-neon-green/15 border border-neon-green/30 text-neon-green text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Staff Replied
                    </span>
                  )}
                  {item.status === 'read' && (
                    <span className="px-3 py-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      In Review
                    </span>
                  )}
                  {item.status === 'new' && (
                    <span className="px-3 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Received (Pending)
                    </span>
                  )}
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-2">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Your Original Message:
                </span>
                <p className="p-4 rounded-xl bg-white/5 text-gray-200 text-xs leading-relaxed border border-white/5">
                  {item.message}
                </p>
              </div>

              {/* Staff Replies */}
              {item.replies && item.replies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs text-neon-green font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-neon-green" />
                    Staff Responses ({item.replies.length}):
                  </span>
                  {item.replies.map((reply: any) => (
                    <div
                      key={reply.id}
                      className="p-4 rounded-2xl bg-neon-green/10 border border-neon-green/20 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neon-green font-medium">
                        <span>Staff Support Reply</span>
                        <span>{new Date(reply.sent_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-24 text-center text-white">Loading Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
