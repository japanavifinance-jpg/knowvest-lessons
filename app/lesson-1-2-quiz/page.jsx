"use client";
import { useState, useEffect } from "react";

const T = {
  teal: "#1D9E75",
  amber: "#F5A623",
  red: "#E8404A",
  purple: "#A78BFA",
  navy: "#0D1B2A",
  navyCard: "#1C2D3F",
  navyDeep: "#0A1520",
  slate: "#8DA0B3",
  offwhite: "#C8D6E2",
  white: "#F0F4F8",
};

const styles = {
  app: { background: T.navy, minHeight: "100vh", color: T.white, fontFamily: "Inter, system-ui, sans-serif" },
  screen: { padding: "20px", maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh" },
  partLabel: { fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: T.slate, textTransform: "uppercase", marginBottom: "6px" },
  partTitle: { fontSize: "21px", fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: "10px" },
  btn: { background: T.teal, color: "#fff", border: "none", borderRadius: "12px", padding: "15px 20px", fontSize: "15px", fontWeight: 700, width: "100%", cursor: "pointer", marginTop: "auto" },
  btnGhost: { background: "transparent", color: T.teal, border: "1.5px solid " + T.teal, borderRadius: "12px", padding: "13px 20px", fontSize: "14px", fontWeight: 600, width: "100%", cursor: "pointer", marginTop: "8px" },
  sceneCard: { background: T.navyCard, borderRadius: "20px", padding: "18px", marginBottom: "14px", textAlign: "center" },
  sceneIcon: { fontSize: "48px", marginBottom: "8px" },
  sceneQ: { fontSize: "15px", fontWeight: 700, color: T.white, lineHeight: 1.3, marginBottom: "4px" },
  sceneSub: { fontSize: "12px", color: T.slate },
  ansGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  ans: { background: T.navyCard, border: "1.5px solid #2a3f56", borderRadius: "14px", padding: "12px 10px", cursor: "pointer", textAlign: "center" },
  ansIcon: { fontSize: "24px", marginBottom: "5px" },
  ansText: { fontSize: "12px", color: T.offwhite, fontWeight: 600, lineHeight: 1.3 },
  meterWrap: { background: T.navyDeep, borderRadius: "8px", height: "14px", width: "100%", overflow: "hidden", marginBottom: "4px" },
  meterLabel: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: T.slate, marginBottom: "14px" },
  notice: { background: "#A78BFA15", border: "1px solid #A78BFA30", borderRadius: "12px", padding: "12px 14px", fontSize: "13px", color: "#c4b5fd", marginBottom: "14px", textAlign: "center" },
  card: { background: T.navyCard, borderRadius: "16px", padding: "16px", marginBottom: "12px" },
  slRow: { marginBottom: "14px" },
  slTop: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  slName: { fontSize: "14px", color: T.offwhite },
  slVal: { fontSize: "15px", fontWeight: 700, color: T.teal },
  costClock: { background: T.navyDeep, border: "1px solid #E8404A30", borderRadius: "16px", padding: "18px", textAlign: "center", marginBottom: "12px" },
  gainBox: { background: T.navyDeep, border: "1px solid #1D9E7530", borderRadius: "16px", padding: "14px", textAlign: "center", marginBottom: "14px" },
  persCard: { borderRadius: "20px", padding: "20px", textAlign: "center", marginBottom: "14px", border: "1.5px solid" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  stat: { background: T.navyCard, borderRadius: "12px", padding: "12px", textAlign: "center" },
  statLabel: { fontSize: "10px", color: T.slate, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  statVal: { fontSize: "17px", fontWeight: 700, color: T.white },
  infoCard: { background: T.navyCard, borderRadius: "20px", padding: "18px", marginBottom: "12px" },
  infoRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  infoIconBox: { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  barWrap: { background: T.navyDeep, borderRadius: "6px", height: "8px", overflow: "hidden", marginTop: "5px" },
  dots: { display: "flex", gap: "5px", justifyContent: "center", padding: "12px 0 14px" },
  nxtWrap: { marginTop: "auto", paddingTop: "10px" },
};

const PERSONALITIES = {
  eagle: { icon: "🦅", name: "The Early Bird", desc: "Small money, compounded early, beats big money late — every time. You already feel it.", rate: "12%", bonus: "¥50,000", col: T.teal, bdr: T.teal + "60" },
  seedling: { icon: "🌱", name: "The Seedling", desc: "The myth had some grip — but you're questioning it. That's exactly what gets you ahead.", rate: "8%", bonus: "¥20,000", col: T.amber, bdr: T.amber + "60" },
  waiter: { icon: "🏔️", name: "The Waiter", desc: "The myth was real for you. That's why you're here — and Part C is about to change that.", rate: "5%", bonus: "none", col: T.red, bdr: T.red + "60" },
};

const EVENTS = [
  {
    icon: "💴", q: "You have ¥500 right now. An ETF unit costs ¥100.", sub: "Is ¥500 enough to actually invest?",
    opts: [
      { icon: "❌", txt: "No — too small to matter", cor: false, why: "¥500 buys 5 real ETF units. Each unit owns a proportional slice of 500 companies. Size does not change your ownership rights." },
      { icon: "✅", txt: "Yes — buys 5 real units", cor: true, why: "Correct. 5 units today at ¥100 = real fractional ownership. Same % return as someone buying 5,000 units." },
    ],
  },
  {
    icon: "🍕", q: "Apple share = ¥28,000. You have ¥1,000.", sub: "Can you own a piece of Apple?",
    opts: [
      { icon: "✅", txt: "Yes — fractional slice", cor: true, why: "Fractional shares let you own 0.035 of a share. When Apple rises 10%, your ¥1,000 rises 10% too. Proportional. Always." },
      { icon: "❌", txt: "No — need ¥28,000 first", cor: false, why: "This is the myth. You do not need the whole pizza. ¥1,000 buys a real slice. The company does not care how much you invested." },
    ],
  },
  {
    icon: "📐", q: "You own 0.035 of a share. Stock rises 10%.", sub: "How much do YOU gain?",
    opts: [
      { icon: "😐", txt: "Nothing — too small", cor: false, why: "Proportional ownership means every percentage move applies equally. 0.035 shares × 10% = exactly 10% gain on your investment." },
      { icon: "📈", txt: "Exactly 10% on my money", cor: true, why: "Correct. Fractional = proportional. Your return percentage is identical to someone who owns 1,000 shares. The math does not discriminate." },
    ],
  },
  {
    icon: "⏳", q: '"I\'ll start when I have ¥100,000 saved."', sub: "What does waiting 3 years actually cost?",
    opts: [
      { icon: "👍", txt: "Nothing — smarter to wait", cor: false, why: "At 7%/yr: ¥5,000/month started today = ¥200k+ in 3 years of compounding you never get back. Waiting is not free." },
      { icon: "💸", txt: "Years of compounding — gone", cor: true, why: "Every month you wait, the compounding clock starts without you. ¥100k threshold is the myth in disguise. ¥100 is the real minimum." },
    ],
  },
  {
    icon: "🏪", q: 'Friend says: "ETFs are for people with real money."', sub: "Myth or fact?",
    opts: [
      { icon: "🤔", txt: "Probably true — ETFs feel serious", cor: false, why: "eMAXIS Slim S&P 500 minimum = ¥100. That's literally one coin. 'For serious investors only' is the myth wearing a suit." },
      { icon: "🚨", txt: "100% myth — minimum is ¥100", cor: true, why: "Correct. ¥100 buys real proportional ownership in 500 of the world's biggest companies. ETFs were designed for everyone." },
    ],
  },
  {
    icon: "📊", q: "¥500/month invested for 30 years at 7%.", sub: "What does it grow to?",
    opts: [
      { icon: "😐", txt: "About ¥180,000 — barely worth it", cor: false, why: "¥500/month × 30 years = ¥180k contributed. But with 7% compounding, the actual value = ¥566,000. Compounding triples your money." },
      { icon: "💰", txt: "Over ¥560,000 — compounding wins", cor: true, why: "Correct. ¥180k contributed → ¥566k total. The extra ¥386k is free money from compounding. Small + consistent beats large + late." },
    ],
  },
  {
    icon: "🧾", q: "Your portfolio shows ¥3,200 after 6 months of ¥500/month.", sub: "Is this a failure?",
    opts: [
      { icon: "😔", txt: "Yes — this is embarrassing", cor: false, why: "¥3,200 after 6 months IS the Capital Myth talking. In 30 years that ¥3,200 seed alone is worth ¥24,000+ at 7%. The start is never the finish." },
      { icon: "💪", txt: "No — the habit is the win", cor: true, why: "Correct. The myth wants you to judge the start by its size. The math judges it by its time. ¥3,200 today → compound growth for decades." },
    ],
  },
  {
    icon: "🗓️", q: "Invest ¥5,000/month starting today vs. starting in 2 years.", sub: "Same total contribution. Who wins?",
    opts: [
      { icon: "🤝", txt: "Same result — same amount", cor: false, why: "Starting today: ~¥652k after 10yr. Starting in 2yr: ~¥476k after 10yr. Two years of compounding = ¥176k difference. Time is not neutral." },
      { icon: "⏩", txt: "Starting today wins — by a lot", cor: true, why: "Correct. 2 lost years = ¥176k gap at 7%/yr. The Capital Myth always costs more than it looks. Starting small now beats waiting to start big." },
    ],
  },
  {
    icon: "🇯🇵", q: "NISA account in Japan. What's the minimum to open and invest?", sub: "Be honest — what did you think before this lesson?",
    opts: [
      { icon: "💭", txt: "Thought you needed ¥50,000+", cor: false, why: "Most expats assume NISA needs big money. Reality: SBI and Rakuten allow NISA investments from ¥100. The barrier was never money — it was the myth." },
      { icon: "✅", txt: "¥100 — the myth lied to me", cor: true, why: "Correct. ¥100 opens a NISA investment at major Japanese brokers. The system is built for small, consistent investing. You were always eligible." },
    ],
  },
  {
    icon: "🏆", q: "¥500/month at age 25 vs ¥50,000/month starting at age 45.", sub: "Same total contributed. Who has more at 65?",
    opts: [
      { icon: "💼", txt: "The ¥50,000 investor — bigger amounts", cor: false, why: "Wrong. The ¥500/month investor wins by a massive margin. 40 years of compounding destroys 20 years of bigger contributions. Time > amount. Always." },
      { icon: "🌱", txt: "The ¥500 investor — time wins", cor: true, why: "Final boss answer. ¥500/month from 25 = ~¥1.3M at 65. ¥50,000/month from 45 = ~¥522k. Small + early + consistent = the only formula that matters." },
    ],
  },
];

function fmt(n) {
  if (n >= 1000000) return "¥" + (n / 1000000).toFixed(1) + "M";
  if (n >= 10000) return "¥" + Math.round(n / 1000) + "k";
  return "¥" + Math.round(n).toLocaleString();
}

function calcCost(sur, wYr) {
  const r = 0.07 / 12;
  const nFull = (wYr + 10) * 12;
  const nWait = 10 * 12;
  const fvNow = sur * ((Math.pow(1 + r, nFull) - 1) / r);
  const fvWait = sur * ((Math.pow(1 + r, nWait) - 1) / r);
  return { cost: Math.round(fvNow - fvWait), gain: Math.round(fvNow), gainWait: Math.round(fvWait) };
}

function Dots({ total, current }) {
  return (
    <div style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i < current ? T.teal : i === current ? T.white : T.navyCard }} />
      ))}
    </div>
  );
}

function MeterBar({ pct }) {
  const color = pct >= 70 ? T.teal : pct >= 40 ? T.amber : T.red;
  return (
    <>
      <div style={styles.meterWrap}>
        <div style={{ height: "100%", borderRadius: "8px", width: pct + "%", background: color, transition: "width 0.6s ease" }} />
      </div>
      <div style={styles.meterLabel}>
        <span>Myth believer</span>
        <span>{pct}% myth-free</span>
      </div>
    </>
  );
}

function AnsBtn({ icon, txt, state, onClick }) {
  const borderColor = state === "correct" ? T.teal : state === "wrong" ? T.red : "#2a3f56";
  const bg = state === "correct" ? T.teal + "20" : state === "wrong" ? T.red + "15" : T.navyCard;
  const opacity = state === "locked" ? 0.45 : 1;
  return (
    <div
      onClick={state === "locked" ? undefined : onClick}
      style={{ ...styles.ans, border: "1.5px solid " + borderColor, background: bg, opacity, pointerEvents: state === "locked" ? "none" : "auto" }}
    >
      <div style={styles.ansIcon}>{icon}</div>
      <div style={styles.ansText}>{txt}</div>
    </div>
  );
}

function Feedback({ type, text }) {
  if (!text) return null;
  const isOk = type === "ok";
  return (
    <div style={{
      borderRadius: "12px", padding: "12px 14px", marginBottom: "10px",
      fontSize: "13px", lineHeight: 1.5,
      background: isOk ? T.teal + "20" : T.red + "15",
      border: "1px solid " + (isOk ? T.teal + "50" : T.red + "40"),
      color: isOk ? "#5DCAA5" : "#ff8080",
    }}>
      {isOk ? "✓ " : "✗ "}{text}
    </div>
  );
}

// ── SCREENS ────────────────────────────────────────────────

function ScreenIntro({ onStart }) {
  return (
    <div style={styles.screen}>
      <Dots total={4} current={0} />
      <div style={styles.partLabel}>Quiz · Lesson 1-1 · The Capital Myth</div>
      <div style={styles.sceneCard}>
        <div style={styles.sceneIcon}>🧠</div>
        <div style={styles.sceneQ}>Did the myth break?</div>
        <div style={{ ...styles.sceneSub, marginTop: "4px" }}>3 rounds. Visuals first. No essays.</div>
      </div>
      <div style={{ background: T.navyCard, borderRadius: "14px", padding: "14px", marginBottom: "12px" }}>
        {[
          { icon: "🎯", title: "Part A — Instinct check", sub: "No right or wrong. Just your gut." },
          { icon: "⏰", title: "Part B — Cost of waiting", sub: "Your real numbers. Live yen cost." },
          { icon: "🎮", title: "Part C — Myth moments", sub: "10 scenes. Spot the myth. Keep your lives." },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i < 2 ? "10px" : 0 }}>
            <div style={{ fontSize: "20px" }}>{r.icon}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: T.white }}>{r.title}</div>
              <div style={{ fontSize: "12px", color: T.slate }}>{r.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.notice}>
        Myth-O-Meter tracks your decisions in Part C.<br />Hit 100% and the myth is officially dead.
      </div>
      <button style={styles.btn} onClick={onStart}>Start →</button>
    </div>
  );
}

function ScreenA({ qNum, icon, q, sub, opts, onPick, picked, onNext }) {
  return (
    <div style={styles.screen}>
      <Dots total={4} current={1} />
      <div style={styles.partLabel}>Part A · Instinct Check</div>
      <div style={styles.notice}>No right or wrong here — just tap what feels true. Your answers shape your investor type.</div>
      <div style={{ fontSize: "11px", color: T.slate, fontWeight: 600, textAlign: "center", marginBottom: "10px" }}>
        Question {qNum} of 3
      </div>
      <div style={styles.sceneCard}>
        <div style={styles.sceneIcon}>{icon}</div>
        <div style={styles.sceneQ}>{q}</div>
        <div style={styles.sceneSub}>{sub}</div>
      </div>
      <div style={styles.ansGrid}>
        {opts.map((o, i) => (
          <AnsBtn key={i} icon={o.icon} txt={o.txt} state={picked === i ? "correct" : undefined} onClick={() => onPick(i)} />
        ))}
      </div>
      <div style={styles.nxtWrap}>
        {picked !== null && (
          <button style={styles.btn} onClick={onNext}>
            {qNum === 3 ? "See my investor type →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

function ScreenPersonality({ pType, onNext }) {
  const p = PERSONALITIES[pType];
  return (
    <div style={styles.screen}>
      <Dots total={4} current={1} />
      <div style={styles.partLabel}>Part A · Your Investor Type</div>
      <div style={{ ...styles.persCard, background: p.col + "20", borderColor: p.bdr }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>{p.icon}</div>
        <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "5px", color: p.col }}>{p.name}</div>
        <div style={{ fontSize: "13px", lineHeight: 1.6, color: T.offwhite }}>{p.desc}</div>
      </div>
      <div style={{ background: T.navyCard, borderRadius: "14px", padding: "14px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", color: T.slate, marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
          Your starting stats for Part C
        </div>
        <div style={styles.statGrid}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Savings rate</div>
            <div style={styles.statVal}>{p.rate}</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Starting bonus</div>
            <div style={styles.statVal}>{p.bonus}</div>
          </div>
        </div>
      </div>
      <button style={styles.btn} onClick={onNext}>See what waiting costs you →</button>
    </div>
  );
}

function ScreenB({ onNext }) {
  const [sur, setSur] = useState(5000);
  const [wYr, setWYr] = useState(2);
  const { cost, gain, gainWait } = calcCost(sur, wYr);
  return (
    <div style={styles.screen}>
      <Dots total={4} current={2} />
      <div style={styles.partLabel}>Part B · Cost of Waiting</div>
      <div style={{ fontSize: "21px", fontWeight: 700, color: T.white, marginBottom: "14px" }}>Your numbers.</div>
      <div style={styles.slRow}>
        <div style={styles.slTop}>
          <span style={styles.slName}>Monthly amount you could invest</span>
          <span style={styles.slVal}>{fmt(sur)}</span>
        </div>
        <input type="range" min="500" max="50000" step="500" value={sur} onChange={e => setSur(Number(e.target.value))} style={{ width: "100%", accentColor: T.teal }} />
      </div>
      <div style={styles.slRow}>
        <div style={styles.slTop}>
          <span style={styles.slName}>Years you're tempted to wait</span>
          <span style={styles.slVal}>{wYr} {wYr === 1 ? "year" : "years"}</span>
        </div>
        <input type="range" min="1" max="10" step="1" value={wYr} onChange={e => setWYr(Number(e.target.value))} style={{ width: "100%", accentColor: T.teal }} />
      </div>
      <div style={styles.costClock}>
        <div style={{ fontSize: "10px", color: T.slate, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Cost of waiting</div>
        <div style={{ fontSize: "34px", fontWeight: 700, color: T.red, lineHeight: 1 }}>{fmt(cost)}</div>
        <div style={{ fontSize: "11px", color: T.slate, marginTop: "4px" }}>in lost compounding gains at 7%/yr</div>
      </div>
      <div style={styles.gainBox}>
        <div style={{ fontSize: "11px", color: T.slate, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>If you start TODAY instead</div>
        <div style={{ fontSize: "26px", fontWeight: 700, color: T.teal }}>{fmt(gain)}</div>
        <div style={{ fontSize: "11px", color: T.slate, marginTop: "3px" }}>vs {fmt(gainWait)} if you wait {wYr}yr</div>
      </div>
      <button style={styles.btn} onClick={() => onNext(sur, wYr, cost)}>I've seen enough — let's play →</button>
    </div>
  );
}

function ScreenC({ onFinish }) {
  const [idx, setIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [mScore, setMScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState({ type: "", text: "" });
  const [answered, setAnswered] = useState(0);

  const ev = EVENTS[idx];
  const pct = answered > 0 ? Math.round((mScore / answered) * 100) : 0;

  function pickOpt(i) {
    if (picked !== null) return;
    const opt = ev.opts[i];
    const newAnswered = answered + 1;
    setAnswered(newAnswered);
    setPicked(i);
    if (!opt.cor) {
      const newLives = lives - 1;
      setLives(newLives);
      setFb({ type: "bad", text: opt.why });
      if (newLives <= 0) {
        setTimeout(() => onFinish(mScore, newAnswered, true), 1200);
      }
    } else {
      const newScore = mScore + 1;
      setMScore(newScore);
      setFb({ type: "ok", text: opt.why });
    }
  }

  function next() {
    const nextIdx = idx + 1;
    if (nextIdx >= 10) {
      onFinish(mScore + (picked !== null && ev.opts[picked]?.cor ? 0 : 0), answered, false);
      return;
    }
    setIdx(nextIdx);
    setPicked(null);
    setFb({ type: "", text: "" });
  }

  function getState(i) {
    if (picked === null) return undefined;
    if (ev.opts[i].cor) return "correct";
    if (i === picked) return "wrong";
    return "locked";
  }

  return (
    <div style={styles.screen}>
      <Dots total={4} current={3} />
      <div style={styles.partLabel}>Part C · Myth Moments</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "11px", color: T.slate, fontWeight: 600 }}>Event {idx + 1} of 10</div>
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ fontSize: "16px" }}>{i < lives ? "❤️" : "🖤"}</span>
          ))}
        </div>
      </div>
      <MeterBar pct={pct} />
      <div style={styles.sceneCard}>
        <div style={styles.sceneIcon}>{ev.icon}</div>
        <div style={styles.sceneQ}>{ev.q}</div>
        <div style={styles.sceneSub}>{ev.sub}</div>
      </div>
      <div style={styles.ansGrid}>
        {ev.opts.map((o, i) => (
          <AnsBtn key={i} icon={o.icon} txt={o.txt} state={getState(i)} onClick={() => pickOpt(i)} />
        ))}
      </div>
      <Feedback type={fb.type} text={fb.text} />
      <div style={styles.nxtWrap}>
        {picked !== null && lives > 0 && (
          <button style={styles.btn} onClick={next}>
            {idx === 9 ? "See my result →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

function ScreenVerdict({ mScore, aScore, pType, costVal, onReplay, onRestart }) {
  const p = PERSONALITIES[pType];
  const pct = Math.round((mScore / 10) * 100);
  const total = Math.round(((mScore / 10) * 0.65 + (aScore / 6) * 0.35) * 100);
  const aPct = Math.round((aScore / 6) * 100);

  let icon, title, body, col;
  if (total >= 80) { icon = "🏆"; title = "Myth: Destroyed."; col = T.teal; body = "You understand fractional ownership, the cost of waiting, and proportional returns. The Capital Myth has no more power over you. Lesson 1-3 is unlocked."; }
  else if (total >= 55) { icon = "🌱"; title = "Myth: Cracking."; col = T.amber; body = "Most of it broke — a few corners held. Replay Part C to lock in the patterns before moving on to Lesson 1-3."; }
  else { icon = "⚠️"; title = "Myth: Still breathing."; col = T.red; body = "The myth still has grip. Go back to the pizza whiteboard in Lesson 1-1. The math will finish what instinct started."; }

  const barColor = (p) => p >= 70 ? T.teal : p >= 40 ? T.amber : T.red;

  return (
    <div style={styles.screen}>
      <Dots total={4} current={4} />
      <div style={styles.partLabel}>Your Result</div>
      <div style={{ fontSize: "38px", textAlign: "center", margin: "12px 0 6px" }}>{icon}</div>
      <div style={{ fontSize: "21px", fontWeight: 700, textAlign: "center", marginBottom: "8px", color: col }}>{title}</div>
      <div style={{ fontSize: "14px", color: T.offwhite, textAlign: "center", lineHeight: 1.6, marginBottom: "14px" }}>{body}</div>
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <div style={{ ...styles.infoIconBox, background: p.col + "20" }}>
            <span style={{ fontSize: "22px" }}>{p.icon}</span>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: T.white }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: T.slate, marginTop: "2px" }}>Investor type · Part A</div>
          </div>
        </div>
        <div style={{ background: T.navyDeep, borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
          {[
            { label: "Myth score", val: mScore + "/10 correct", pctVal: pct, color: barColor(pct) },
            { label: "Instinct score", val: aScore + "/6", pctVal: aPct, color: T.purple },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom: i === 0 ? "10px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: T.slate, marginBottom: "5px" }}>
                <span>{row.label}</span>
                <span style={{ color: T.white, fontWeight: 700 }}>{row.val}</span>
              </div>
              <div style={styles.barWrap}>
                <div style={{ height: "100%", borderRadius: "6px", width: row.pctVal + "%", background: row.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...styles.infoRow, marginBottom: 0 }}>
          <div style={{ ...styles.infoIconBox, background: T.red + "20" }}>
            <span style={{ fontSize: "20px" }}>⏳</span>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: T.red }}>{costVal}</div>
            <div style={{ fontSize: "12px", color: T.slate, marginTop: "2px" }}>your cost of waiting (Part B)</div>
          </div>
        </div>
      </div>
      {total >= 80 ? (
        <button style={styles.btn} onClick={() => alert("Lesson 1-3: Volatility vs Ruin — unlocked!")}>
          Unlock Lesson 1-3 →
        </button>
      ) : (
        <>
          <button style={styles.btn} onClick={onReplay}>Replay Part C →</button>
          <button style={styles.btnGhost} onClick={onRestart}>Start over</button>
        </>
      )}
    </div>
  );
}

function ScreenBusted({ mScore, onReplay, onRestart }) {
  return (
    <div style={styles.screen}>
      <Dots total={4} current={4} />
      <div style={styles.partLabel}>Your Result</div>
      <div style={{ fontSize: "38px", textAlign: "center", margin: "12px 0 6px" }}>💔</div>
      <div style={{ fontSize: "21px", fontWeight: 700, textAlign: "center", marginBottom: "8px", color: T.red }}>The myth fought back.</div>
      <div style={{ fontSize: "14px", color: T.offwhite, textAlign: "center", lineHeight: 1.6, marginBottom: "20px" }}>
        You ran out of lives — but opening this quiz means you're already questioning the myth. Review the explanations and replay Part C.
      </div>
      <div style={{ ...styles.infoCard, textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: T.slate, marginBottom: "6px" }}>Myth score</div>
        <div style={{ fontSize: "28px", fontWeight: 700, color: T.amber }}>{mScore}/10</div>
        <div style={{ fontSize: "12px", color: T.slate, marginTop: "4px" }}>correct before lives ran out</div>
      </div>
      <button style={styles.btn} onClick={onReplay}>Replay Part C →</button>
      <button style={styles.btnGhost} onClick={onRestart}>Start over</button>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────

const A_QUESTIONS = [
  { icon: "👜", q: "You find ¥500 in an old jacket.", sub: "What do you do with it?", opts: [{ icon: "☕", txt: "Treat myself — coffee or snack" }, { icon: "🐖", txt: "Drop it in my savings jar" }, { icon: "📈", txt: "Straight into my investment account" }, { icon: "🤷", txt: "Honestly, ¥500 doesn't feel like it matters" }] },
  { icon: "🗣️", q: '"I\'ll start investing when I save up ¥100,000."', sub: "Have you said this? Does it sound right?", opts: [{ icon: "👍", txt: "Yes — makes sense to wait" }, { icon: "😬", txt: "I've said this exact thing" }, { icon: "⏳", txt: "Waiting costs more than you think" }, { icon: "🤔", txt: "Not sure — depends on the person" }] },
  { icon: "🍕", q: "You have ¥500. An ETF unit costs ¥100.", sub: "What goes through your mind?", opts: [{ icon: "😐", txt: "5 units feels pointless" }, { icon: "💡", txt: "I can own 5 real slices right now" }, { icon: "⏸️", txt: "I'd rather wait and invest more at once" }, { icon: "❓", txt: "I don't know what an ETF unit is" }] },
];

function scoreA(picks) {
  const correct = [2, 2, 1];
  const partial = [[1], [1], []];
  let s = 0;
  picks.forEach((p, i) => {
    if (p === correct[i]) s += 2;
    else if (partial[i].includes(p)) s += 1;
  });
  return s;
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [aQ, setAQ] = useState(0);
  const [aPicks, setAPicks] = useState([null, null, null]);
  const [currentPick, setCurrentPick] = useState(null);
  const [pType, setPType] = useState("waiter");
  const [costVal, setCostVal] = useState("—");
  const [cKey, setCKey] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [busted, setBusted] = useState(false);

  function pickA(i) {
    setCurrentPick(i);
  }

  function nextA() {
    const newPicks = [...aPicks];
    newPicks[aQ] = currentPick;
    setAPicks(newPicks);
    setCurrentPick(null);
    if (aQ < 2) {
      setAQ(aQ + 1);
    } else {
      const s = scoreA(newPicks);
      setPType(s >= 5 ? "eagle" : s >= 3 ? "seedling" : "waiter");
      setScreen("personality");
    }
  }

  function handleCFinish(mScore, _answered, bustedOut) {
    setFinalScore(mScore);
    setBusted(bustedOut);
    setScreen("verdict");
  }

  function replayC() {
    setCKey(k => k + 1);
    setScreen("partC");
  }

  function restart() {
    setScreen("intro");
    setAQ(0);
    setAPicks([null, null, null]);
    setCurrentPick(null);
    setCKey(k => k + 1);
  }

  const aScore = scoreA(aPicks);

  return (
    <div style={styles.app}>
      {screen === "intro" && <ScreenIntro onStart={() => setScreen("partA")} />}
      {screen === "partA" && (
        <ScreenA
          qNum={aQ + 1}
          icon={A_QUESTIONS[aQ].icon}
          q={A_QUESTIONS[aQ].q}
          sub={A_QUESTIONS[aQ].sub}
          opts={A_QUESTIONS[aQ].opts}
          picked={currentPick}
          onPick={pickA}
          onNext={nextA}
        />
      )}
      {screen === "personality" && <ScreenPersonality pType={pType} onNext={() => setScreen("partB")} />}
      {screen === "partB" && (
        <ScreenB onNext={(sur, wYr, cost) => { setCostVal(fmt(cost)); setScreen("partC"); }} />
      )}
      {screen === "partC" && <ScreenC key={cKey} onFinish={handleCFinish} />}
      {screen === "verdict" && !busted && (
        <ScreenVerdict mScore={finalScore} aScore={aScore} pType={pType} costVal={costVal} onReplay={replayC} onRestart={restart} />
      )}
      {screen === "verdict" && busted && (
        <ScreenBusted mScore={finalScore} onReplay={replayC} onRestart={restart} />
      )}
    </div>
  );
}
