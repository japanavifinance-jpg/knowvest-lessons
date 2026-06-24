'use client';

import { useEffect, useState, Suspense } from 'react'; // 👈 1. Added Suspense
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyDFVDqRSY3AFRw00aF7uiAo1yXJGHNhA5U",
  authDomain: "japanaviwealth.firebaseapp.com",
  projectId: "japanaviwealth",
  storageBucket: "japanaviwealth.firebasestorage.app",
  messagingSenderId: "886986947572",
  appId: "1:886986947572:web:2ea442a6ffd873e21157a1"
};

// prevent duplicate Firebase init in Next.js
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

// ── LESSON CONFIG ──
const LESSONS = [
  {
    id: 'lesson_1_1',
    num: '1-1',
    emoji: '💸',
    title: 'The Capital Myth',
    url: 'https://project-0d07n.vercel.app/lesson-1-1',
    quizUrl: 'https://project-0d07n.vercel.app/lesson-1-1-quiz',
    desc: 'Think you need more money to start? This lesson dismantles the most common reason people never begin.',
  },
  {
    id: 'lesson_1_2',
    num: '1-2',
    emoji: '💧',
    title: 'The Liquidity Line',
    url: 'https://project-0d07n.vercel.app/lesson-1-2',
    quizUrl: 'https://project-0d07n.vercel.app/lesson-1-2-quiz',
    desc: 'Know exactly how much cash to keep on the sidelines — and how much is just fear in disguise.',
  },
  {
    id: 'lesson_1_3',
    num: '1-3',
    emoji: '📉',
    title: 'Volatility vs. Ruin',
    url: null,
    quizUrl: null,
    desc: 'Learn the difference between normal market swings and the kind of loss you never recover from.',
  },
  {
    id: 'lesson_1_4',
    num: '1-4',
    emoji: '📅',
    title: 'The Timing Trap',
    url: null,
    quizUrl: null,
    desc: 'Why waiting for the right moment is itself the wrong move.',
  },
];

const BASE_URL = 'https://project-0d07n.vercel.app';

// ── STYLES ──
const s = {
  root:        { fontFamily: "'Inter', system-ui, sans-serif", background: '#0D1B2A', color: '#F0F4F8', minHeight: '100vh' },
  center:      { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 24px', textAlign: 'center', gap: 12 },
  body:        { padding: 16 },
  hero:        { background: '#0A1520', padding: '28px 20px 20px', borderBottom: '1px solid #1C2D3F' },
  eyebrow:     { fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 8 },
  headline:    { fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 },
  heroSub:     { fontSize: 13, color: '#8DA0B3', marginBottom: 16 },
  chips:       { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip:        { display: 'flex', alignItems: 'center', gap: 5, background: '#1C2D3F', border: '1px solid #263d55', borderRadius: 20, padding: '5px 10px', fontSize: 12, color: '#C8D6E2', fontWeight: 500 },
  chipDot:     { width: 6, height: 6, borderRadius: '50%', background: '#378ADD' },
  upnext:      { borderRadius: 16, padding: 16, marginBottom: 20, border: '1.5px solid', background: '#0d1a28' },
  unEyebrow:   { fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 },
  unTitle:     { fontSize: 17, fontWeight: 700, color: '#F0F4F8', marginBottom: 5 },
  unDesc:      { fontSize: 13, color: '#8DA0B3', lineHeight: 1.5, marginBottom: 14 },
  ctaTeal:     { width: '100%', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#1D9E75', color: '#F0F4F8', letterSpacing: '0.02em' },
  ctaAmber:    { width: '100%', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#2a1f00', color: '#F5A623', border: '1px solid #F5A623', letterSpacing: '0.02em' },
  secLabel:    { fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8DA0B3', marginBottom: 12 },
  l0card:      { borderRadius: 14, padding: '14px 16px', border: '1.5px solid', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  l0emoji:     { fontSize: 22, lineHeight: 1 },
  l0info:      { flex: 1 },
  l0num:       { fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 },
  l0title:     { fontSize: 14, fontWeight: 700, color: '#F0F4F8' },
  l0status:    { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500 },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 14 },
  card:        { borderRadius: 14, padding: 13, border: '1.5px solid', display: 'flex', flexDirection: 'column', gap: 5, minHeight: 115 },
  cardEmoji:   { fontSize: 18, lineHeight: 1 },
  cardNum:     { fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
  cardTitle:   { fontSize: 13, fontWeight: 700, color: '#F0F4F8', lineHeight: 1.3, flex: 1 },
  cardStatus:  { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, marginTop: 2 },
  dot:         { width: 5, height: 5, borderRadius: '50%', flexShrink: 0 },
  boss:        { border: '1.5px dashed #F5A623', borderRadius: 14, background: '#0D1B2A', padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 },
  bossIcon:    { fontSize: 28 },
  bossLabel:   { fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5A623', marginBottom: 3 },
  bossTitle:   { fontSize: 15, fontWeight: 700, color: '#F0F4F8', marginBottom: 2 },
  bossSub:     { fontSize: 12, color: '#8DA0B3' },
  divider:     { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  divLine:     { flex: 1, height: 1, background: '#1C2D3F' },
  divPill:     { fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, color: '#8DA0B3', border: '1px solid #263d55', background: '#0D1B2A', whiteSpace: 'nowrap' },
  lockedHint:  { fontSize: 11, color: '#8DA0B3', textAlign: 'center', padding: '8px 0 20px', opacity: 0.4 },
  spinWrap:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
  loadText:    { fontSize: 13, color: '#8DA0B3' },
  gateIcon:    { fontSize: 40, marginBottom: 8 },
  gateTitle:   { fontSize: 20, fontWeight: 700, color: '#F0F4F8' },
  gateSub:     { fontSize: 14, color: '#8DA0B3', lineHeight: 1.6, maxWidth: 280 },
};

const CARD_THEME = {
  locked:     { bg: '#0D1B2A', border: '#1C2D3F', color: '#8DA0B3', opacity: 0.45, cursor: 'default', pointer: 'none' },
  active:     { bg: '#1a2a3d', border: '#378ADD', color: '#378ADD', opacity: 1,    cursor: 'pointer', pointer: 'auto' },
  inprogress: { bg: '#1a1f2e', border: '#8DA0B3', color: '#8DA0B3', opacity: 1,    cursor: 'pointer', pointer: 'auto', dashed: true },
  complete:   { bg: '#0e2a1e', border: '#1D9E75', color: '#1D9E75', opacity: 1,    cursor: 'default', pointer: 'none' },
  failed:     { bg: '#2a0d0d', border: '#E8404A', color: '#E8404A', opacity: 1,    cursor: 'pointer', pointer: 'auto' },
};

const L0_THEME = {
  not_started:      { bg: '#1a2a3d', border: '#378ADD', color: '#378ADD', num: 'Level 0',          text: 'Up next'        },
  inprogress:       { bg: '#1a1f2e', border: '#8DA0B3', color: '#8DA0B3', num: 'Level 0',          text: 'In progress'    },
  complete_green:   { bg: '#0e2a1e', border: '#1D9E75', color: '#1D9E75', num: 'Level 0 · Done',   text: 'Complete'       },
  complete_blocked: { bg: '#2a1500', border: '#F5A623', color: '#F5A623', num: 'Level 0 · Done',   text: 'Action needed'  },
};

// ── 2. MOVE CORE ROADMAP LOGIC TO INTERNAL COMPONENT ──
function RoadmapContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  const [screen, setScreen]     = useState('loading');
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (!uid) { setScreen('gate'); return; }
    fetchProgress();
  }, [uid]);

  async function fetchProgress() {
    try {
      const ref  = doc(db, 'users', uid, 'progress', 'summary');
      const snap = await getDoc(ref);
      setProgress(snap.exists() ? snap.data() : {});
      setScreen('main');
    } catch (err) {
      console.error(err);
      setScreen('error');
    }
  }

  const l0       = progress.level0 || {};
  const l0Status = l0.status  || 'not_started';
  const l0Out    = l0.outcome || null;

  const lessonStates = {};
  for (const lesson of LESSONS) {
    const saved = progress[lesson.id] || {};
    lessonStates[lesson.id] = {
      status:     saved.status     || 'locked',
      quizPassed: saved.quizPassed || false,
      attempts:   saved.attempts   || 0,
    };
  }

  function navigate(url) {
    if (!url) return;
    window.location.href = `${url}?uid=${uid}`;
  }

  function getUpNext() {
    if (l0Status === 'not_started') return {
      border: '#378ADD', eyeColor: '#378ADD', eye: '▶ Up next · Lesson 0',
      title: 'The Mirror',
      desc: "Before we talk about money — let's talk about where you are. Be honest, this isn't graded.",
      cta: '▶ Start lesson', ctaStyle: 'teal',
      action: () => navigate(`${BASE_URL}/lesson-0`),
    };
    if (l0Status === 'inprogress') return {
      border: '#8DA0B3', eyeColor: '#8DA0B3', eye: '⏸ In progress · Lesson 0',
      title: 'The Mirror',
      desc: "You started this lesson but didn't finish. Pick up where you left off.",
      cta: '▶ Continue lesson', ctaStyle: 'teal',
      action: () => navigate(`${BASE_URL}/lesson-0`),
    };
    if (l0Status === 'complete' && l0Out !== 'green') return {
      border: '#F5A623', eyeColor: '#F5A623', eye: '⚠ Action needed · Lesson 0',
      title: 'Not ready to invest yet',
      desc: "Based on your audit, you have steps to take before investing. Clear your debt or build your emergency fund first.",
      cta: '↺ Re-take the audit', ctaStyle: 'amber',
      action: () => navigate(`${BASE_URL}/lesson-0`),
    };

    const next = LESSONS.find(l => {
      const st = lessonStates[l.id]?.status;
      return st === 'active' || st === 'inprogress' || st === 'failed';
    });

    if (!next) return {
      border: '#1D9E75', eyeColor: '#1D9E75', eye: '✓ Level 1 Complete',
      title: 'All lessons done!',
      desc: "You've completed Level 1. The next level is coming soon.",
      cta: '— Stay tuned', ctaStyle: 'teal',
      action: () => {},
    };

    const st       = lessonStates[next.id]?.status;
    const isFailed = st === 'failed';
    const isInProg = st === 'inprogress';
    return {
      border: isFailed ? '#E8404A' : '#378ADD',
      eyeColor: isFailed ? '#E8404A' : '#378ADD',
      eye: isFailed  ? `↺ Retry · Lesson ${next.num} Quiz`
         : isInProg  ? `⏸ In progress · Lesson ${next.num}`
         :             `▶ Up next · Lesson ${next.num}`,
      title: next.title,
      desc: isFailed
        ? "You didn't pass the quiz this time. Review the lesson and try again — no limit on retries."
        : next.desc,
      cta: isFailed ? '↺ Retry quiz' : isInProg ? '▶ Continue lesson' : '▶ Start lesson',
      ctaStyle: 'teal',
      action: () => navigate(isFailed ? next.quizUrl : next.url),
    };
  }

  function getL0Theme() {
    if (l0Status === 'not_started') return L0_THEME.not_started;
    if (l0Status === 'inprogress')  return L0_THEME.inprogress;
    if (l0Out === 'green')          return L0_THEME.complete_green;
    return L0_THEME.complete_blocked;
  }

  if (screen === 'loading') return (
    <div style={s.root}>
      <div style={s.spinWrap}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spinner{width:36px;height:36px;border:3px solid #1C2D3F;border-top-color:#1D9E75;border-radius:50%;animation:spin .8s linear infinite}`}</style>
        <div className="spinner" />
        <div style={s.loadText}>Loading your progress...</div>
      </div>
    </div>
  );

  if (screen === 'gate') return (
    <div style={s.root}>
      <div style={s.center}>
        <div style={s.gateIcon}>🔒</div>
        <div style={s.gateTitle}>Access denied</div>
        <div style={s.gateSub}>This page must be opened from the Knowvest app. Please return to the app to continue.</div>
      </div>
    </div>
  );

  if (screen === 'error') return (
    <div style={s.root}>
      <div style={s.center}>
        <div style={s.gateIcon}>⚠️</div>
        <div style={s.gateTitle}>Something went wrong</div>
        <div style={s.gateSub}>We couldn't load your progress. Please close and reopen the Learn tab.</div>
        <button style={s.ctaTeal} onClick={fetchProgress}>Try again</button>
      </div>
    </div>
  );

  const upNext   = getUpNext();
  const l0Theme  = getL0Theme();
  const showL1   = l0Status === 'complete' && l0Out === 'green';

  return (
    <div style={s.root}>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.eyebrow}>Financial Path</div>
        <h1 style={s.headline}>Learn to invest right.</h1>
        <div style={s.heroSub}>4 levels · 22 lessons · 1 goal</div>
        <div style={s.chips}>
          <div style={s.chip}><span>🔥</span><span>5-day streak</span></div>
          <div style={s.chip}><span>⚡</span><span>320 XP</span></div>
          <div style={s.chip}><span style={s.chipDot} /><span>Level 1</span></div>
        </div>
      </div>

      <div style={s.body}>
        {/* UP NEXT */}
        <div style={{ ...s.upnext, borderColor: upNext.border }}>
          <div style={{ ...s.unEyebrow, color: upNext.eyeColor }}>{upNext.eye}</div>
          <div style={s.unTitle}>{upNext.title}</div>
          <div style={s.unDesc}>{upNext.desc}</div>
          <button
            style={upNext.ctaStyle === 'amber' ? s.ctaAmber : s.ctaTeal}
            onClick={upNext.action}
          >
            {upNext.cta}
          </button>
        </div>

        {/* LEVEL 0 */}
        <div style={s.secLabel}>Level 0 · The Mirror</div>
        <div
          style={{ ...s.l0card, background: l0Theme.bg, borderColor: l0Theme.border }}
          onClick={() => navigate(`${BASE_URL}/lesson-0`)}
        >
          <div style={s.l0emoji}>🪞</div>
          <div style={s.l0info}>
            <div style={{ ...s.l0num, color: l0Theme.color }}>{l0Theme.num}</div>
            <div style={s.l0title}>The Mirror</div>
          </div>
          <div style={{ ...s.l0status, color: l0Theme.color }}>
            <div style={{ ...s.dot, background: l0Theme.color }} />
            {l0Theme.text}
          </div>
        </div>

        {/* LEVEL 1 */}
        {showL1 && (
          <>
            <div style={s.secLabel}>Level 1 · Logistical Layer</div>
            <div style={s.grid}>
              {LESSONS.map(lesson => {
                const st    = lessonStates[lesson.id]?.status || 'locked';
                const theme = CARD_THEME[st] || CARD_THEME.locked;
                const onTap = theme.pointer === 'auto'
                  ? () => navigate(st === 'failed' ? lesson.quizUrl : lesson.url)
                  : undefined;

                return (
                  <div
                    key={lesson.id}
                    style={{
                      ...s.card,
                      background: theme.bg,
                      borderColor: theme.border,
                      borderStyle: theme.dashed ? 'dashed' : 'solid',
                      opacity: theme.opacity,
                      cursor: theme.cursor,
                      pointerEvents: theme.pointer,
                    }}
                    onClick={onTap}
                  >
                    <span style={s.cardEmoji}>{lesson.emoji}</span>
                    <div style={{ ...s.cardNum, color: theme.color }}>{lesson.num}</div>
                    <div style={s.cardTitle}>{lesson.title}</div>
                    <div style={s.cardStatus}>
                      <div style={{ ...s.dot, background: theme.color }} />
                      <span style={{ color: theme.color }}>
                        {st === 'locked'     ? '🔒 Locked'
                       : st === 'active'     ? 'Up next'
                       : st === 'inprogress' ? 'In progress'
                       : st === 'complete'   ? 'Complete'
                       : st === 'failed'     ? 'Quiz failed — retry'
                       : '🔒 Locked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOSS */}
            <div style={{ ...s.boss, opacity: 0.45, pointerEvents: 'none' }}>
              <div style={s.bossIcon}>🗡️</div>
              <div>
                <div style={s.bossLabel}>Level 1 Boss</div>
                <div style={s.bossTitle}>The Execution Threshold</div>
                <div style={s.bossSub}>Complete all lessons to unlock</div>
              </div>
            </div>
          </>
        )}

        {/* LOCKED LEVELS */}
        <div style={s.divider}><div style={s.divLine}/><div style={s.divPill}>Level 2 · Locked 🔒</div><div style={s.divLine}/></div>
        <div style={s.lockedHint}>Market Mechanics · 6 lessons</div>

        <div style={s.divider}><div style={s.divLine}/><div style={s.divPill}>Level 3 · Locked 🔒</div><div style={s.divLine}/></div>
        <div style={s.lockedHint}>NISA Mastery · 7 lessons</div>

        <div style={s.divider}><div style={s.divLine}/><div style={s.divPill}>Level 4 · Locked 🔒</div><div style={s.divLine}/></div>
        <div style={s.lockedHint}>Portfolio Strategy · 8 lessons</div>
      </div>
    </div>
  );
}

// ── 3. CLEAN WRAPPED DEFAULT EXPORT FOR NEXT.JS COMPILER ──
export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ color: '#8DA0B3', fontSize: 14 }}>Initializing Layout Roadmap...</div>
      </div>
    }>
      <RoadmapContent />
    </Suspense>
  );
}