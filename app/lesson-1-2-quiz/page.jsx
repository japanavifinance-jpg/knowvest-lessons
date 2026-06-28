"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // 👈 Added tracking hooks
import { initializeApp, getApps } from "firebase/app"; // 👈 Added Firebase modules
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFVDqRSY3AFRw00aF7uiAo1yXJGHNhA5U",
  authDomain: "japanaviwealth.firebaseapp.com",
  projectId: "japanaviwealth",
  storageBucket: "japanaviwealth.firebasestorage.app",
  messagingSenderId: "886986947572",
  appId: "1:886986947572:web:2ea442a6ffd873e21157a1"
};
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

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
  { icon: "💴", q: "You have ¥500 right now. An ETF unit costs ¥100.", sub: "Is ¥500 enough to actually invest?", opts: [ { icon: "❌", txt: "No — too small to matter", cor: false, why: "¥500 buys 5 real ETF units. Each unit owns a proportional slice of 500 companies. Size does not change your ownership rights." }, { icon: "✅", txt: "Yes — buys 5 real units", cor: true, why: "Correct. 5 units today at ¥100 = real fractional ownership. Same % return as someone buying 5,000 units." } ] },
  { icon: "🍕", q: "Apple share = ¥28,000. You have ¥1,000.", sub: "Can you own a piece of Apple?", opts: [ { icon: "✅", txt: "Yes — fractional slice", cor: true, why: "Fractional shares let you own 0.035 of a share. When Apple rises 10%, your ¥1,000 rises 10% too. Proportional. Always." }, { icon: "❌", txt: "No — need ¥28,000 first", cor: false, why: "This is the myth. You do not need the whole pizza. ¥1,000 buys a real slice. The company does not care how much you invested." } ] },
  { icon: "📐", q: "You own 0.035 of a share. Stock rises 10%.", sub: "How much do YOU gain?", opts: [ { icon: "😐", txt: "Nothing — too small", cor: false, why: "Proportional ownership means every percentage move applies equally. 0.035 shares × 10% = exactly 10% gain on your investment." }, { icon: "📈", txt: "Exactly 10% on my money", cor: true, why: "Correct. Fractional = proportional. Your return percentage is identical to someone who owns 1,000 shares. The math does not discriminate." } ] },
  { icon: "⏳", q: '"I\'ll start when I have ¥100,000 saved."', sub: "What does waiting 3 years actually cost?", opts: [ { icon: "👍", txt: "Nothing — smarter to wait", cor: false, why: "At 7%/yr: ¥5,000/month started today = ¥200k+ in 3 years of compounding you never get back. Waiting is not free." }, { icon: "💸", txt: "Years of compounding — gone", cor: true, why: "Every month you wait, the compounding clock starts without you. ¥100k threshold is the myth in disguise. ¥100 is the real minimum." } ] },
  { icon: "✈️", q: 'Friend says: "ETFs are for people with real money."', sub: "Myth or fact?", opts: [ { icon: "🤔", txt: "Probably true — ETFs feel serious", cor: false, why: "eMAXIS Slim S&P 500 minimum = ¥100. That's literally one coin. 'For serious investors only' is the myth wearing a suit." }, { icon: "🚨", txt: "100% myth — minimum is ¥100", cor: true, why: "Correct. ¥100 buys real proportional ownership in 500 of the world's biggest companies. ETFs were designed for everyone." } ] },
  { icon: "📊", q: "¥500/month invested for 30 years at 7%.", sub: "What does it grow to?", opts: [ { icon: "😐", txt: "About ¥180,000 — barely worth it", cor: false, why: "¥500/month × 30 years = ¥180k contributed. But with 7% compounding, the actual value = ¥566,000. Compounding triples your money." }, { icon: "💰", txt: "Over ¥560,000 — compounding wins", cor: true, why: "Correct. ¥180k contributed → ¥566k total. The extra ¥386k is free money from compounding. Small + consistent beats large + late." } ] },
  { icon: "🧾", q: "Your portfolio shows ¥3,200 after 6 months of ¥500/month.", sub: "Is this a failure?", opts: [ { icon: "😔", txt: "Yes — this is embarrassing", cor: false, why: "¥3,200 after 6 months IS the Capital Myth talking. In 30 years that ¥3,200 seed alone is worth ¥24,000+ at 7%. The start is never the finish." }, { icon: "💪", txt: "No — the habit is the win", cor: true, why: "Correct. The myth wants you to judge the start by its size. The math judges it by its time. ¥3,200 today → compound growth for decades." } ] },
  { icon: "🗓️", q: "Invest ¥5,000/month starting today vs. starting in 2 years.", sub: "Same total contribution. Who wins?", opts: [ { icon: "🤝", txt: "Same result — same amount", cor: false, why: "Starting today: ~¥652k after 10yr. Starting in 2yr: ~¥476k after 10yr. Two years of compounding = ¥176k difference. Time is not neutral." }, { icon: "⏩", txt: "Starting today wins — by a lot", cor: true, why: "Correct. 2 lost years = ¥176k gap at 7%/yr. The Capital Myth always costs more than it looks. Starting small now beats waiting to start big." } ] },
  { icon: "🇯🇵", q: "NISA account in Japan. What's the minimum to open and invest?", sub: "Be honest — what did you think before this lesson?", opts: [ { icon: "💭", txt: "Thought you needed ¥50,000+", cor: false, why: "Most expats assume NISA needs big money. Reality: SBI and Rakuten allow NISA investments from ¥100. The barrier was never money — it was the myth." }, { icon: "✅", txt: "¥100 — the myth lied to me", cor: true, why: "Correct. ¥100 opens a NISA investment at major Japanese brokers. The system is built for small, consistent investing. You were always eligible." } ] },
  { icon: "🏆", q: "¥500/month at age 25 vs ¥50,000/month starting at age 45.", sub: "Same total contributed. Who has more at 65?", opts: [ { icon: "💼", txt: "The ¥50,000 investor — bigger amounts", cor: false, why: "Wrong. The ¥500/month investor wins by a massive margin. 40 years of compounding destroys 20 years of bigger contributions. Time > amount. Always." }, { icon: "🌱", txt: "The ¥500 investor — time wins", cor: true, why: "Final boss answer. ¥500/month from 25 = ~¥1.3M at 65. ¥50,000/month from 45 = ~¥522k. Small + early + consistent = the only formula that matters." } ] }
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
    <div onClick={state === "locked" ? undefined : onClick} style={{ ...styles.ans, border: "1.5px solid " + borderColor, background: bg, opacity, pointerEvents: state === "locked" ? "none" : "auto" }}>
      <div style={styles.ansIcon}>{icon}</div>
      <div style={styles.ansText}>{txt}</div>
    </div>
  );
}

function Feedback({ type, text }) {
  if (!text) return null;
  const isOk = type === "ok";
  return (
    <div style={{ borderRadius: "12px", padding: "12px 14px", marginBottom: "10px", fontSize: "13px", lineHeight: 1.5, background: isOk ? T.teal + "20" : T.red + "15", border: "1px solid " + (isOk ? T.teal + "50" : T.red + "40"), color: isOk ? "#5DCAA5" : "#ff8080" }}>
      {isOk ? "✓ " : "✗ "}{text}
    </div>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const urlUid = searchParams.get("uid");
  const uid = urlUid || (typeof window !== "undefined" ? sessionStorage.getItem("knowvest_uid") : null);

  const [screen, setScreen]           = useState("intro");
  const [aQ, setAQ]                   = useState(0);
  const [aPicks, setAPicks]           = useState([null, null, null]);
  const [currentPick, setCurrentPick] = useState(null);
  const [pType, setPType]             = useState("waiter");
  const [costVal, setCostVal]         = useState("—");
  const [finalScore, setFinalScore]   = useState(0);
  const [busted, setBusted]           = useState(false);
  
  // Part C Inner States
  const [idx, setIdx]                 = useState(0);
  const [lives, setLives]             = useState(3);
  const [mScore, setMScore]           = useState(0);
  const [picked, setPicked]           = useState(null);
  const [fb, setFb]                   = useState({ type: "", text: "" });
  const [answered, setAnswered]       = useState(0);
  const [existingAttempts, setExistingAttempts] = useState(0);

  useEffect(() => {
    if (urlUid && typeof window !== "undefined") {
      sessionStorage.setItem("knowvest_uid", urlUid);
    }
    if (uid) {
      const ref = doc(db, "users", uid, "progress", "summary");
      getDoc(ref).then(snap => {
        if (snap.exists() && snap.data().lesson_1_1) {
          setExistingAttempts(snap.data().lesson_1_1.attempts || 0);
        }
      }).catch(e => console.error(e));
    }
  }, [urlUid, uid]);

  const ev = EVENTS[idx] || EVENTS[0];
  const isLast = idx === EVENTS.length - 1;
  const evBorderColor = ev?.isBoss ? T.red : ev?.isMarket ? T.blue : T.navyMid;
  const pct = Math.min(100, (answered / 10) * 100);

  const pickPQ = (choice) => {
    if (pChosen) return;
    setCurrentPick(choice);
  };

  const nextPQ = () => {
    const nextScore = pScore + (currentPick ? currentPick.score : 0);
    if (aQ < PERSONALITY_QS.length - 1) {
      setAPicks(p => { const n = [...p]; n[aQ] = currentPick; return n; });
      setAQ(i => i + 1);
      setCurrentPick(null);
    } else {
      setPersonality(getPersonality(nextScore));
      setScreen("personality");
    }
  };

  const pick = (choice) => {
    if (picked !== null) return;
    const isCorrect = choice.cor;
    const newLives = isCorrect ? lives : lives - 1;
    const newScore = isCorrect ? mScore + 1 : mScore;
    setPicked(choice);
    setMScore(newScore);
    setAnswered(a => a + 1);
    setFb({ type: isCorrect ? "ok" : "err", text: choice.why });
    if (!isCorrect) setLives(newLives);
    setHistory(h => [...h, { icon: ev.icon, title: ev.q, correct: isCorrect, label: choice.txt }]);
    
    if (!isCorrect && newLives <= 0) {
      setBusted(true);
      saveQuizOutcome(false, newScore);
      setScreen("result");
    }
  };

  const next = async () => {
    if (busted || isLast) {
      const passed = lives > 0 && mScore >= 7;
      await saveQuizOutcome(passed, mScore);
      setFinalScore(mScore);
      setScreen("result");
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    setFb({ type: "", text: "" });
  };

  async function saveQuizOutcome(passed, finalScore) {
    if (!uid) return;
    try {
      const ref = doc(db, "users", uid, "progress", "summary");
      const nextAttempts = existingAttempts + 1;
      const update = {
        lesson_1_1: {
          status: passed ? "complete" : "failed",
          quizPassed: passed,
          attempts: nextAttempts,
          lastScore: `${finalScore}/10`,
          completedAt: serverTimestamp()
        }
      };
      if (passed) {
        update.lesson_1_2 = { status: "active", quizPassed: false, attempts: 0 };
      } else {
        update.lesson_1_2 = { status: "locked" };
      }
      await setDoc(ref, update, { merge: true });
      setExistingAttempts(nextAttempts);
    } catch (e) {
      console.error(e);
    }
  }

  function routeToDashboard() {
    window.location.href = `https://project-0d07n.vercel.app/roadmap.html?uid=${uid}`;
  }

  const [pScore, setPersonalityScore] = useState(0);
  const [personality, setPersonality] = useState(null);
  const [history, setHistory]         = useState([]);

  if (screen === "intro") {
    return (
      <Wrap>
        <div style={{ padding:"40px 0 20px", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🚀</div>
          <h1 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>The Capital Simulator</h1>
          <p style={{ color:T.slate, fontSize:14, lineHeight:1.6, maxWidth:320, margin:"0 auto 24px" }}>Test your wealth discipline through 10 real-world asset chapters. Prove you've beaten the myth.</p>
          <PrimaryBtn onClick={() => setScreen("partA")}>Begin Assessment →</PrimaryBtn>
        </div>
      </Wrap>
    );
  }

  if (screen === "partA") {
    const q = PERSONALITY_QS[aQ];
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <PartLabel text="Round 1 · Saving Profile" />
          <div style={styles.partTitle}>Instinct Check</div>
        </div>
        <Dots total={3} current={aQ} />
        <Box>
          <div style={styles.sceneCard}>
            <div style={styles.sceneIcon}>{q.icon}</div>
            <div style={styles.sceneQ}>{q.q}</div>
            <div style={styles.sceneSub}>{q.sub}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.choices.map((c, i) => (
              <button key={i} onClick={() => { setPersonalityScore(s => s + c.score); setCurrentPick(i); }} style={{ width: "100%", background: currentPick === i ? T.teal + "20" : T.navyDeep, border: "2px solid " + (currentPick === i ? T.teal : T.navyMid), borderRadius: "12px", padding: "14px", color: T.white, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                <span>{c.icon} {c.label}</span>
              </button>
            ))}
          </div>
          {currentPick !== null && <Btn onClick={nextPQ}>Next →</Btn>}
        </Box>
      </Wrap>
    );
  }

  if (screen === "personality") {
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <PartLabel text="Round 1 Complete" />
          <div style={styles.partTitle}>Investor Matrix Profile</div>
        </div>
        <div style={{ ...styles.persCard, background: personality?.col + "20", borderColor: personality?.bdr }}>
          <div style={{ fontSize:52, marginBottom:8 }}>{personality?.icon}</div>
          <div style={{ fontSize:20, fontWeight:900, color: personality?.col, marginBottom:4 }}>{personality?.name}</div>
          <div style={{ fontSize:13, color: T.offwhite, lineHeight:1.6 }}>{personality?.desc}</div>
        </div>
        <PrimaryBtn onClick={() => setScreen("partB")}>Continue to Numbers →</PrimaryBtn>
      </Wrap>
    );
  }

  if (screen === "partB") {
    const { cost, gain, gainWait } = calcCost(income, expenses);
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <PartLabel text="Round 2 · The Clock" />
          <div style={styles.partTitle}>The Cost of Waiting</div>
        </div>
        <Box>
          <SliderField label="Monthly investment potential" value={income} onChange={setIncome} min={1000} max={100000} step={1000} display={yen(income)} color={T.teal} />
          <SliderField label="Years delayed" value={expenses} onChange={setExpenses} min={1} max={10} step={1} display={expenses + " years"} color={T.slate} />
          <div style={styles.costClock}>
            <div style={styles.statLabel}>Compounding loss value</div>
            <div style={{ fontSize:32, color: T.red, fontWeight:900 }}>{yenF(cost)}</div>
          </div>
          <PrimaryBtn onClick={() => setScreen("partC")}>Launch Simulation Engine →</PrimaryBtn>
        </Box>
      </Wrap>
    );
  }

  if (screen === "partC") {
    return (
      <Wrap>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0 10px" }}>
          <PartLabel text={`Round 3 · Event ${idx+1}/10`} />
          <div>{Array.from({ length: 3 }).map((_, i) => <span key={i}>{i < lives ? "❤️" : "🖤"}</span>)}</div>
        </div>
        <div style={styles.meterWrap}>
          <div style={{ height: "100%", background: T.teal, width: pct + "%", transition: "width 0.4s" }} />
        </div>
        <div style={styles.sceneCard}>
          <div style={styles.sceneIcon}>{ev.icon}</div>
          <div style={styles.sceneQ}>{ev.q}</div>
          <div style={styles.sceneSub}>{ev.sub}</div>
        </div>
        <div style={styles.ansGrid}>
          {ev.opts.map((o, i) => (
            <button key={i} onClick={() => pick(i)} style={{ background: picked === o ? (o.cor ? T.teal + "20" : T.red + "20") : T.navyCard, border: "2px solid " + (picked === o ? (o.cor ? T.teal : T.red) : T.navyMid), padding:12, borderRadius:12, color:T.white, cursor:"pointer" }}>
              <div>{o.icon}</div>
              <div style={{ fontSize:12, marginTop:4 }}>{o.txt}</div>
            </button>
          ))}
        </div>
        <Feedback type={fb.type} text={fb.text} />
        {picked !== null && <PrimaryBtn onClick={next}>Next →</PrimaryBtn>}
      </Wrap>
    );
  }

  if (screen === "result") {
    const passed = !busted && mScore >= 7;
    return (
      <Wrap>
        <div style={{ textAlign:"center", padding:"40px 0" }}>
          <div style={{ fontSize:64 }}>{passed ? "🏆" : "💥"}</div>
          <h1 style={{ fontSize:22, fontWeight:900, margin:"14px 0" }}>{passed ? "Myth Destroyed!" : "Colony Overwhelmed"}</h1>
          <p style={{ color:T.slate, fontSize:14, maxWidth:300, margin:"0 auto 20px" }}>{passed ? "You've successfully unlocked Lesson 1-2 on the roadmap." : "The capital myth retained its grip. Try rewriting your choices."}</p>
          <div style={styles.infoCard}>
            <div style={{ fontSize:14 }}>Final Simulation Score</div>
            <div style={{ fontSize:36, color: passed ? T.teal : T.amber, fontWeight:900 }}>{mScore} / 10</div>
          </div>
          <PrimaryBtn onClick={routeToDashboard}>Return to Dashboard</PrimaryBtn>
        </div>
      </Wrap>
    );
  }

  return null;
}

export default function QuizApp() {
  return (
    <Suspense fallback={<div style={{ background: T.navy, minHeight: "100vh" }} />}>
      <QuizContent />
    </Suspense>
  );
}

const A_QUESTIONS = []; // kept for references