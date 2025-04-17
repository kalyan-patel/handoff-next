import nodemailer from 'nodemailer';

export async function POST(request) {
  const body = await request.json();
  const { to, subject, text } = body;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  try {
    await transporter.sendMail({
      from: "Tufts Handoff <notifications@handoff.shop>",
      to,
      subject,
      text,
    });

    return new Response(JSON.stringify({ message: 'Email sent!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}