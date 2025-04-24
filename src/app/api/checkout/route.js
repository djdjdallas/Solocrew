import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const supabase = createServerClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { poolId, dealId, providerId, amount, title, description } = body;
    
    if (!poolId || !dealId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get user details for Stripe metadata
    const { data: userData } = await supabase
      .from('users')
      .select('first_name, last_name, email')
      .eq('id', session.user.id)
      .single();
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: description,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        poolId,
        dealId,
        providerId,
        userEmail: userData?.email || session.user.email,
        userName: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/explore/${dealId}`,
    });
    
    return NextResponse.json({ sessionId: checkoutSession.id });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing the payment' },
      { status: 500 }
    );
  }
}
