import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  const supabase = createServerClient();
  
  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, poolId, dealId, providerId } = session.metadata;
        
        if (!userId || !poolId || !dealId) {
          throw new Error('Missing metadata in checkout session');
        }
        
        // Create booking record
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert({
            user_id: userId,
            deal_id: dealId,
            pool_id: poolId,
            provider_id: providerId,
            payment_id: session.id,
            amount_paid: session.amount_total / 100,
            status: 'confirmed',
            booking_details: {
              paymentMethod: session.payment_method_types[0],
              customerEmail: session.customer_details?.email,
              customerName: session.customer_details?.name,
            },
          });
        
        if (bookingError) {
          throw new Error(`Error creating booking: ${bookingError.message}`);
        }
        
        // Update the user's pool member status
        const { error: poolMemberError } = await supabase
          .from('pool_members')
          .update({ status: 'confirmed' })
          .eq('pool_id', poolId)
          .eq('user_id', userId);
        
        if (poolMemberError) {
          throw new Error(`Error updating pool member: ${poolMemberError.message}`);
        }
        
        // Notify the user via email (would be implemented with SendGrid)
        // This is a placeholder for the actual email sending logic
        console.log(`Booking confirmed for user ${userId} for deal ${dealId}`);
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`❌ Payment failed: ${paymentIntent.id}`);
        
        // Handle the failed payment, possibly by notifying the user
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
