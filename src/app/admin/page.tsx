'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Mail,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

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

interface Stats {
  total: number;
  newCount: number;
  readCount: number;
  repliedCount: number;
}

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, newCount: 0, readCount: 0, repliedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'all' ? `/api/admin/inquiries?status=${statusFilter}` : '/api/admin/inquiries';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setStats(data.stats || { total: 0, newCount: 0, readCount: 0, repliedCount: 0 });
      }
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(q) ||
      inquiry.email.toLowerCase().includes(q) ||
      (inquiry.subject && inquiry.subject.toLowerCase().includes(q)) ||
      (inquiry.product && inquiry.product.toLowerCase().includes(q)) ||
      inquiry.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Inquiries Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage customer requests, orders, and send email replies directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            download
            className="px-4 py-2.5 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/25 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            Export CSV
          </a>
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-white/20 text-xs font-semibold flex items-center gap-2 text-gray-300 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Inquiries</p>
            <p className="text-3xl font-bold font-display text-white mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">New (Unread)</p>
            <p className="text-3xl font-bold font-display text-neon-green mt-1">{stats.newCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Read / Pending</p>
            <p className="text-3xl font-bold font-display text-warning-amber mt-1">{stats.readCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning-amber/10 border border-warning-amber/30 flex items-center justify-center text-warning-amber">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Replied</p>
            <p className="text-3xl font-bold font-display text-neon-purple mt-1">{stats.repliedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'new', label: 'New ⚡' },
            { key: 'read', label: 'Read' },
            { key: 'replied', label: 'Replied' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? 'bg-neon-green text-dark-900 font-bold shadow-neon-green'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-neon-green/50"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No inquiries found matching your filter.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredInquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href={`/admin/inquiries/${inquiry.id}`}
                className="block p-5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-neon-green/40 group-hover:text-neon-green transition-colors mt-0.5 md:mt-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">
                          {inquiry.name}
                        </h3>
                        <span className="text-xs text-gray-400">&lt;{inquiry.email}&gt;</span>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inquiry.status === 'new'
                              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30 shadow-neon-green'
                              : inquiry.status === 'read'
                              ? 'bg-warning-amber/20 text-warning-amber border border-warning-amber/30'
                              : 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                          }`}
                        >
                          {inquiry.status}
                        </span>

                        {inquiry.product && (
                          <span className="px-2 py-0.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-semibold">
                            {inquiry.product}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 font-medium mt-1">
                        {inquiry.subject || 'No Subject'}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(inquiry.created_at).toLocaleString()}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-neon-green group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
