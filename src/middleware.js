import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Authentication checks
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register') || 
                      req.nextUrl.pathname.startsWith('/reset');
  
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/profile') || 
                          req.nextUrl.pathname.startsWith('/bookings');
  
  const isProviderRoute = req.nextUrl.pathname.startsWith('/provider');
  
  if (isAuthRoute && session) {
    // Redirect to dashboard if the user is already logged in
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access protected routes without session
    return NextResponse.redirect(new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url));
  }
  
  if (isProviderRoute) {
    if (!session) {
      // Redirect to login if trying to access provider routes without session
      return NextResponse.redirect(new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url));
    }
    
    // Check if the user is a provider
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', session.user.id)
      .single();
    
    if (!provider) {
      // Redirect to home if the user is not a provider
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/reset',
    '/dashboard/:path*',
    '/profile/:path*',
    '/bookings/:path*',
    '/provider/:path*',
  ],
};
