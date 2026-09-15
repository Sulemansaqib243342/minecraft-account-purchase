import db from './db';

export interface StoredInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  product: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface StoredReply {
  id: number;
  inquiry_id: number;
  message: string;
  sent_at: string;
}

// Global in-memory cache to preserve records across Vercel serverless container invocations
const globalStore = globalThis as unknown as {
  __inquiriesCache: StoredInquiry[];
  __repliesCache: StoredReply[];
  __lastId: number;
};

if (!globalStore.__inquiriesCache) {
  globalStore.__inquiriesCache = [];
}

if (!globalStore.__repliesCache) {
  globalStore.__repliesCache = [];
}

if (!globalStore.__lastId) {
  globalStore.__lastId = 0;
}

// Sync SQLite DB with global memory cache
export function syncDbWithCache() {
  try {
    // 1. Fetch any items from DB into cache
    const dbInquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all() as StoredInquiry[];
    for (const inq of dbInquiries) {
      if (!globalStore.__inquiriesCache.some((c) => c.id === inq.id)) {
        globalStore.__inquiriesCache.push(inq);
      } else {
        // Sync status updates
        const cached = globalStore.__inquiriesCache.find((c) => c.id === inq.id);
        if (cached) cached.status = inq.status;
      }
      if (inq.id > globalStore.__lastId) {
        globalStore.__lastId = inq.id;
      }
    }

    // 2. Re-seed SQLite DB from cache if SQLite DB was reset on Vercel container cold-start
    for (const cachedInq of globalStore.__inquiriesCache) {
      const exists = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(cachedInq.id);
      if (!exists) {
        db.prepare(`
          INSERT OR IGNORE INTO inquiries (id, name, email, subject, message, product, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          cachedInq.id,
          cachedInq.name,
          cachedInq.email,
          cachedInq.subject || '',
          cachedInq.message,
          cachedInq.product || '',
          cachedInq.status,
          cachedInq.created_at
        );
      }
    }

    // 3. Sync replies
    const dbReplies = db.prepare('SELECT * FROM replies ORDER BY sent_at ASC').all() as StoredReply[];
    for (const rep of dbReplies) {
      if (!globalStore.__repliesCache.some((r) => r.id === rep.id)) {
        globalStore.__repliesCache.push(rep);
      }
    }

    for (const cachedRep of globalStore.__repliesCache) {
      const exists = db.prepare('SELECT id FROM replies WHERE id = ?').get(cachedRep.id);
      if (!exists) {
        db.prepare(`
          INSERT OR IGNORE INTO replies (id, inquiry_id, message, sent_at)
          VALUES (?, ?, ?, ?)
        `).run(cachedRep.id, cachedRep.inquiry_id, cachedRep.message, cachedRep.sent_at);
      }
    }
  } catch (err) {
    console.error('Persistent store sync error:', err);
  }
}

export function saveNewInquiry(inquiryData: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  product?: string;
}): StoredInquiry {
  syncDbWithCache();

  const newId = globalStore.__lastId + 1;
  globalStore.__lastId = newId;

  const nowIso = new Date().toISOString();

  const newInquiry: StoredInquiry = {
    id: newId,
    name: inquiryData.name,
    email: inquiryData.email,
    subject: inquiryData.subject || '',
    message: inquiryData.message,
    product: inquiryData.product || '',
    status: 'new',
    created_at: nowIso,
  };

  // Push to memory cache first
  globalStore.__inquiriesCache.unshift(newInquiry);

  // Insert into SQLite DB
  try {
    db.prepare(`
      INSERT INTO inquiries (id, name, email, subject, message, product, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
    `).run(
      newInquiry.id,
      newInquiry.name,
      newInquiry.email,
      newInquiry.subject,
      newInquiry.message,
      newInquiry.product,
      newInquiry.created_at
    );
  } catch (err) {
    console.error('Error saving to SQLite:', err);
  }

  return newInquiry;
}

export function saveNewReply(inquiryId: number, message: string): StoredReply {
  syncDbWithCache();

  const nowIso = new Date().toISOString();
  const replyId = Date.now();

  const newReply: StoredReply = {
    id: replyId,
    inquiry_id: inquiryId,
    message,
    sent_at: nowIso,
  };

  globalStore.__repliesCache.push(newReply);

  // Update inquiry status in cache & DB
  const inq = globalStore.__inquiriesCache.find((i) => i.id === inquiryId);
  if (inq) inq.status = 'replied';

  try {
    db.prepare(`
      INSERT INTO replies (id, inquiry_id, message, sent_at)
      VALUES (?, ?, ?, ?)
    `).run(newReply.id, newReply.inquiry_id, newReply.message, newReply.sent_at);

    db.prepare(`UPDATE inquiries SET status = 'replied' WHERE id = ?`).run(inquiryId);
  } catch (err) {
    console.error('Error saving reply to SQLite:', err);
  }

  return newReply;
}

export function getAllInquiries(statusFilter?: string) {
  syncDbWithCache();

  let list = [...globalStore.__inquiriesCache];
  if (statusFilter && ['new', 'read', 'replied'].includes(statusFilter)) {
    list = list.filter((i) => i.status === statusFilter);
  }

  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getInquiryById(id: number) {
  syncDbWithCache();

  const inq = globalStore.__inquiriesCache.find((i) => i.id === id);
  const replies = globalStore.__repliesCache.filter((r) => r.inquiry_id === id);

  return { inquiry: inq || null, replies };
}
