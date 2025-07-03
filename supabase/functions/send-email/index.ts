import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data }: EmailRequest = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Email templates
    const templates = {
      'booking-confirmation': `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${data.userName},</p>
        <p>Your booking for <strong>${data.mixingTitle}</strong> has been confirmed!</p>
        <p><strong>Organizer:</strong> ${data.organizerName}</p>
        <p><strong>Participants:</strong></p>
        <ul>
          ${data.participantNames.map((name: string) => `<li>${name}</li>`).join('')}
        </ul>
        <p>We look forward to seeing you at the event!</p>
      `,
      'waiting-list': `
        <h2>Added to Waiting List</h2>
        <p>Hi ${data.userName},</p>
        <p>You've been added to the waiting list for <strong>${data.mixingTitle}</strong>.</p>
        <p><strong>Organizer:</strong> ${data.organizerName}</p>
        <p>We'll notify you if a spot becomes available.</p>
      `,
      'spot-available': `
        <h2>Spot Available!</h2>
        <p>Hi ${data.userName},</p>
        <p>Great news! A spot is now available for <strong>${data.mixingTitle}</strong>.</p>
        <p><strong>Organizer:</strong> ${data.organizerName}</p>
        <p><a href="${data.mixingUrl}">Book your spot now!</a></p>
      `,
      'event-reminder': `
        <h2>Event Reminder</h2>
        <p>Hi ${data.userName},</p>
        <p>Don't forget about <strong>${data.mixingTitle}</strong> coming up!</p>
        <p><strong>Organizer:</strong> ${data.organizerName}</p>
        <p><strong>Date:</strong> ${data.eventDate}</p>
        <p><strong>Time:</strong> ${data.eventTime}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p>See you there!</p>
      `
    };

    // Get email template
    const emailContent = templates[template as keyof typeof templates];
    
    if (!emailContent) {
      throw new Error(`Template ${template} not found`);
    }

    // Send email using your preferred email service
    // This is a placeholder - you would integrate with SendGrid, Mailgun, etc.
    console.log('Email would be sent:', {
      to,
      subject,
      content: emailContent
    });

    // Log email sending attempt
    await supabaseClient
      .from('email_logs')
      .insert({
        to_email: to,
        subject,
        template,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});