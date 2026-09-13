import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Query admin user securely with parameterized query
    const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
    const admin = stmt.get(username) as { id: number; username: string; password_hash: string } | undefined;

    if (!admin) {
      // Return constant time error message to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Create JWT and set in httpOnly cookie
    const token = await createToken({ id: admin.id, username: admin.username });
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
