const express = require('express');
const { Readable } = require('stream');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const BUDDY_VOICES = {
  rocky:   { id: 'MNKK2Wl2wbbsEPQTHZGt', stability: 0.45, style: 0.55, similarity: 0.80 }, // energetic
  castor:  { id: 'pNInz6obpgDQGcFmaJgB', stability: 0.75, style: 0.10, similarity: 0.85 }, // calm, warm
  orignal: { id: 'onwK4e9ZLuTAKqWW03F9', stability: 0.70, style: 0.15, similarity: 0.80 }, // deep, wise
  outarde: { id: 'MF3mGyEYCl7XYWbV9V6O', stability: 0.30, style: 0.75, similarity: 0.75 }, // silly, expressive
};

const speedCache = new Map();

router.post('/set-speed', requireAuth, async (req, res) => {
  const { speed } = req.body;
  if (![0.7, 1.0, 1.2].includes(speed)) return res.status(400).json({ error: 'invalid speed' });
  speedCache.set(req.user.id, speed);
  res.json({ ok: true });
});

router.post('/', requireAuth, async (req, res) => {
  const { text, buddyId } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text required' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ELEVENLABS_API_KEY not set' });

  const voice = BUDDY_VOICES[buddyId] || BUDDY_VOICES.rocky;
  const speed = speedCache.get(req.user.id) ?? 1.0;

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voice.stability,
            similarity_boost: voice.similarity,
            style: voice.style,
            use_speaker_boost: true,
            speed: speed,
          },
          optimize_streaming_latency: 3,
        }),
      }
    );

    if (!elevenRes.ok) {
      const err = await elevenRes.text();
      console.error('[TTS] ElevenLabs error:', err);
      return res.status(502).json({ error: 'TTS failed' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    Readable.fromWeb(elevenRes.body).pipe(res);
  } catch (err) {
    console.error('[TTS] exception:', err.message);
    res.status(500).json({ error: 'TTS failed' });
  }
});

module.exports = router;
