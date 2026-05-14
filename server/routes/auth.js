const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const { randomUUID } = require('crypto');
const supabase = require('../lib/supabase');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function makeJWT(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '365d' }
  );
}

async function upsertUser({ id, email, name }) {
  const { data: existing, error: selErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (selErr && selErr.code !== 'PGRST116') throw selErr;
  if (existing) return existing;

  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: id || randomUUID(),
      email,
      name: name || email.split('@')[0],
      plan: 'free',
      sessions_this_month: 0,
      seconds_used: 0,
      reset_date: resetDate,
      memory: {},
      stripe_customer_id: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name } = ticket.getPayload();
    const user = await upsertUser({ id: sub, email, name });
    res.json({ token: makeJWT(user), user });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(400).json({ error: 'Google auth failed', detail: err.message });
  }
});

router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const frontendUrl = process.env.FRONTEND_URL || 'https://getfrench-kids.vercel.app';
    const link = `${frontendUrl}/auth?token=${token}`;

    const { error } = await getResend().emails.send({
      from: 'GetFrench Kids <hello@getfrench.app>',
      to: email,
      subject: 'Your GetFrench Kids login link',
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;max-width:480px">
        <tr><td style="text-align:center;padding-bottom:24px">
          <span style="font-size:48px">🦝</span>
          <h1 style="margin:12px 0 4px;font-size:22px;color:#1e1b4b">GetFrench Kids</h1>
          <p style="margin:0;color:#6b7280;font-size:14px">Your sign-in link</p>
        </td></tr>
        <tr><td style="padding-bottom:24px">
          <p style="margin:0 0 8px;color:#374151;font-size:15px">
            Click the link below to sign in. It expires in <strong>1 hour</strong>.
          </p>
        </td></tr>
        <tr><td align="center" style="padding-bottom:24px">
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#ef4444;border-radius:8px;padding:14px 32px">
              <a href="${link}" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;display:block">
                Sign in to GetFrench Kids
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding-bottom:24px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Or copy this link into your browser:</p>
          <p style="margin:8px 0 0;word-break:break-all">
            <a href="${link}" style="color:#ef4444;font-size:13px">${link}</a>
          </p>
        </td></tr>
        <tr><td style="border-top:1px solid #e5e7eb;padding-top:20px">
          <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center">
            If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (error) return res.status(500).json({ error: 'Failed to send magic link', detail: error.message });
    res.json({ ok: true });
  } catch (err) {
    console.error('Magic link error:', err?.message);
    res.status(500).json({ error: 'Failed to send magic link', detail: err?.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token missing' });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      const msg = jwtErr.name === 'TokenExpiredError' ? 'Link expired' : 'Invalid link';
      return res.status(400).json({ error: msg });
    }
    const { email } = payload;
    const user = await upsertUser({ email });
    res.json({ token: makeJWT(user), user });
  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(400).json({ error: 'Invalid or expired link' });
  }
});

module.exports = router;
