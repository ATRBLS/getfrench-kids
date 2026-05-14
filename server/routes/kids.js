const express = require('express');
const supabase = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/setup', requireAuth, async (req, res) => {
  try {
    const { childName, childAge, schoolLevel } = req.body;
    if (!childName || !childAge) return res.status(400).json({ error: 'Missing required fields' });

    const profileData = {
      parent_id: req.user.id,
      child_name: childName,
      child_age: Number(childAge),
      school_level: schoolLevel || 'grade_1_3',
      maple_count: 0,
      timbit_count: 0,
      streak_count: 0,
      last_session_date: null,
      session_count: 0,
      memory: {},
    };

    const { data, error } = await supabase
      .from('kids_profiles')
      .upsert(profileData, { onConflict: 'parent_id' })
      .select()
      .single();

    if (error) {
      console.error('[kids/setup] Supabase error:', error.message);
      return res.json({ ...profileData, id: 'mock', _mock: true });
    }

    res.json(data);
  } catch (err) {
    console.error('[kids/setup] Error:', err.message);
    res.status(500).json({ error: 'Setup failed' });
  }
});

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kids_profiles')
      .select('*')
      .eq('parent_id', req.user.id)
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') return res.json(null);
      console.error('[kids/profile] Supabase error:', error?.message);
      return res.json(null);
    }

    res.json(data);
  } catch (err) {
    console.error('[kids/profile] Error:', err.message);
    res.json(null);
  }
});

router.post('/rewards', requireAuth, async (req, res) => {
  try {
    const { mapleEarned = 0, timbitEarned = 0 } = req.body;

    const today = new Date().toISOString().split('T')[0];

    const { data: profile } = await supabase
      .from('kids_profiles')
      .select('streak_count, last_session_date, maple_count, timbit_count, session_count')
      .eq('parent_id', req.user.id)
      .single();

    if (!profile) return res.json({ ok: true });

    const lastDate = profile.last_session_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = profile.streak_count || 0;
    if (lastDate === yesterday) newStreak += 1;
    else if (lastDate !== today) newStreak = 1;

    await supabase
      .from('kids_profiles')
      .update({
        maple_count: (profile.maple_count || 0) + mapleEarned,
        timbit_count: (profile.timbit_count || 0) + timbitEarned,
        streak_count: newStreak,
        last_session_date: today,
        session_count: (profile.session_count || 0) + 1,
      })
      .eq('parent_id', req.user.id);

    res.json({ ok: true, newStreak });
  } catch (err) {
    console.error('[kids/rewards] Error:', err.message);
    res.json({ ok: true });
  }
});

module.exports = router;
