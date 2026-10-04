import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createAuthToken, getSitePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const sitePassword = getSitePassword();

    if (!password || password.trim() !== sitePassword.trim()) {
      return NextResponse.json(
        { error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    const token = await createAuthToken(sitePassword);

    const response = NextResponse.json({ success: true, message: 'Authentication successful' });
    
    // Set HTTP-only secure cookie for 30 days
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
