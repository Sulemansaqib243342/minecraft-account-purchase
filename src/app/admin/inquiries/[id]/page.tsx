'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  User,
  Package,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  product: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

interface Reply {
  id: number;
  inquiry_id: number;
  message: string;
  sent_at: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInquiry(data.inquiry);
        setReplies(data.replies || []);
      } else {
        router.push('/admin');
      }
    } catch {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: 'success', message: data.message });
        setReplyText('');
        fetchDetail(); // Refresh conversation
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to send reply' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error occurred while sending reply.' });
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin mx-auto mb-4" />
        <p className="font-display">Loading Inquiry Details...</p>
      </div>
    );
  }

  if (!inquiry) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Inquiry Header Card */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  inquiry.status === 'new'
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                    : inquiry.status === 'read'
                    ? 'bg-warning-amber/20 text-warning-amber border border-warning-amber/30'
                    : 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                }`}
              >
                {inquiry.status}
              </span>
              {inquiry.product && (
                <span className="px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold">
                  Product: {inquiry.product}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold font-display text-white">
              {inquiry.subject || 'Inquiry #' + inquiry.id}
            </h1>
          </div>

          {/* Quick status switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Status:</span>
            {['new', 'read', 'replied'].map((st) => (
              <button
                key={st}
                onClick={() => updateStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  inquiry.status === st
                    ? 'bg-white/20 text-white border border-white/30 font-bold'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-neon-green flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Customer</p>
              <p className="text-xs font-semibold text-white">{inquiry.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-neon-cyan flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</p>
              <a href={`mailto:${inquiry.email}`} className="text-xs font-semibold text-neon-cyan hover:underline">
                {inquiry.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-neon-purple flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Received On</p>
              <p className="text-xs font-semibold text-gray-300">
                {new Date(inquiry.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Message Box */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Customer Message:
          </h3>
          <div className="p-5 rounded-2xl bg-dark-800 border border-white/10 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </div>
        </div>
      </div>

      {/* Existing Reply Thread */}
      {replies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-purple font-display flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Reply History ({replies.length})
          </h3>

          <div className="space-y-3">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="glass rounded-2xl p-5 border border-neon-purple/20 bg-neon-purple/5"
              >
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span className="font-semibold text-neon-purple">Admin Response</span>
                  <span>{new Date(reply.sent_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Composer */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/10">
        <h3 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
          <Send className="w-5 h-5 text-neon-green" />
          Send Email Reply
        </h3>
        <p className="text-xs text-gray-400 mb-6">
          Your reply will be sent via Resend directly to{' '}
          <span className="text-neon-green font-semibold">{inquiry.email}</span>.
        </p>

        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 ${
              feedback.type === 'success'
                ? 'bg-neon-green/15 border border-neon-green/30 text-neon-green'
                : 'bg-warning-red/15 border border-warning-red/30 text-warning-red'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSendReply} className="space-y-4">
          <div>
            <textarea
              required
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the customer..."
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 transition-all"
            />
          </div>

          <div className="flex justify-end">
            <NeonButton
              variant="green"
              size="md"
              className="flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply Email
                </>
              )}
            </NeonButton>
          </div>
        </form>
      </div>
    </div>
  );
}
