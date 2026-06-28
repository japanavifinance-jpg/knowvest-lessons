"use client";
import { useState, useEffect, useRef, Suspense } from "react"; // 👈 1. Added Suspense
import { useSearchParams } from "next/navigation";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
  navy:"#0D1B2A", navyMid:"#152130", navyCard:"#1C2D3F", navyDeep:"#0A1520",
  teal:"#1D9E75", amber:"#F5A623", red:"#E8404A",
  purple:"#A78BFA", blue:"#60A5FA", slate:"#8DA0B3", white:"#F0F4F8", offWhite:"#C8D6E2",
};

const fmt = (n) => {
  if (n >= 1000000) return `¥${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `¥${(n/1000).toFixed(0)}k`;
  return `¥${Math.round(n).toLocaleString()}`;
};
const fmtFull = (n) => `¥${Math.round(n).toLocaleString()}`;

// ── WB: Curious ───────────────────────────────────────────────
function WB_Curious({ play }) {
  const bars = [
    { label:"Year 1",  now:12,  later:0,  delay:0.3 },
    { label:"Year 5",  now:28,  later:18, delay:0.5 },
    { label:"Year 10", now:52,  later:40, delay:0.7 },
    { label:"Year 20", now:100, later:76, delay:0.9 },
  ];
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.slate, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
        ¥10,000/month — Start Now vs. Wait 1 Year
      </div>
      {bars.map((b,i) => (
        <div key={i} style={{ marginBottom:10 }}>
          <div style={{ fontSize:10, color:T.slate, marginBottom:4 }}>{b.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:52, fontSize:10, color:T.teal, textAlign:"right" }}>Now</div>
              <div style={{ flex:1, height:14, background:T.navyDeep, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:3, background:T.teal,
                  width: play ? `${b.now}%` : "0%",
                  transition: play ? `width 0.7s ease ${b.delay}s` : "none" }} />
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:52, fontSize:10, color:T.red, textAlign:"right" }}>+1 yr</div>
              <div style={{ flex:1, height:14, background:T.navyDeep, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:3, background:`${T.red}90`,
                  width: play ? `${b.later}%` : "0%",
                  transition: play ? `width 0.7s ease ${b.delay+0.15}s` : "none" }} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop:12, padding:"10px 12px", background:T.navyDeep, borderRadius:8,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.4s":"none" }}>
        <span style={{ color:T.teal, fontWeight:700, fontSize:12 }}>~¥5.2M </span>
        <span style={{ color:T.slate, fontSize:12 }}>vs </span>
        <span style={{ color:T.red, fontWeight:700, fontSize:12 }}>~¥4.7M </span>
        <span style={{ color:T.offWhite, fontSize:12 }}>— this gap is permanent.</span>
      </div>
    </div>
  );
}

// ── WB: Behind ────────────────────────────────────────────────
function WB_Behind({ play }) {
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.slate, marginBottom:14, textTransform:"uppercase", letterSpacing:0.8 }}>
        ¥20,000/month — wealth is still reachable at any age
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"flex-end", height:130, marginBottom:12 }}>
        {[
          { label:"Start at 25", height:100, val:"~¥39.7M", color:T.teal,   delay:0.3 },
          { label:"Start at 35", height:62,  val:"~¥24.3M", color:T.purple, delay:0.6 },
          { label:"Never start", height:6,   val:"¥0",      color:T.red,    delay:0.9 },
        ].map((b,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
            <div style={{ fontSize:10, fontWeight:700, color:b.color, marginBottom:4, textAlign:"center",
              opacity:play?1:0, transition:play?`opacity 0.4s ease ${b.delay+0.5}s`:"none" }}>
              {b.val}
            </div>
            <div style={{ width:"100%", borderRadius:"4px 4px 0 0",
              background:`${b.color}70`, border:`1.5px solid ${b.color}`,
              height:play?`${b.height}%`:"0%",
              transition:play?`height 0.8s ease ${b.delay}s`:"none" }} />
            <div style={{ fontSize:10, color:T.slate, marginTop:6, textAlign:"center", lineHeight:1.3 }}>{b.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 12px", background:T.navyDeep, borderRadius:8,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.6s":"none",
        fontSize:12, color:T.offWhite, lineHeight:1.6 }}>
        Even starting at 35: <span style={{ color:T.purple, fontWeight:700 }}>~¥24.3M.</span>
        {" "}Starting late still beats never starting.
      </div>
    </div>
  );
}

// ── WB: Cautious ──────────────────────────────────────────────
function WB_Cautious({ play }) {
  const steps = [
    { icon:"💳", label:"Carried high-interest debt while investing", delay:0.3 },
    { icon:"📅", label:"Invested money they needed back too soon",   delay:0.6 },
    { icon:"📉", label:"Panic-sold during a market dip",            delay:0.9 },
  ];
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.amber, marginBottom:12, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>
        "I tried investing" — The 3 real failure points
      </div>
      {steps.map((s,i) => (
        <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
          padding:"10px 12px", background:T.navyDeep, borderRadius:8, marginBottom:8,
          opacity:play?1:0, transform:play?"none":"translateX(-10px)",
          transition:play?`opacity 0.5s ease ${s.delay}s, transform 0.5s ease ${s.delay}s`:"none" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
          <div style={{ fontSize:13, color:T.offWhite }}>{s.label}</div>
        </div>
      ))}
      <div style={{ marginTop:4, padding:"10px 14px", borderRadius:8,
        background:`${T.teal}15`, border:`1px solid ${T.teal}40`,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.4s":"none",
        fontSize:12, color:T.teal, fontWeight:700 }}>
        ↓ Verdict: Sequencing failure — not a market failure.
      </div>
    </div>
  );
}

// ── WB: Anxious ───────────────────────────────────────────────
function WB_Anxious({ play }) {
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.slate, marginBottom:14, textTransform:"uppercase", letterSpacing:0.8 }}>
        ¥1,000,000 — 10 years later: "Safe" vs Invested
      </div>
      <div style={{ display:"flex", gap:12 }}>
        {[
          { label:"Savings Account", sublabel:"Interest ~0.1%", endVal:"¥1,001,000", subVal:"Real value ~¥970,000", color:T.red,  note:"Loses to inflation (~3%/yr)", delay:0.3 },
          { label:"Index Fund",      sublabel:"Avg ~7%/yr",     endVal:"~¥1.97M",    subVal:"Nearly doubled",      color:T.teal, note:"Time keeps growing your money", delay:0.6 },
        ].map((c,i) => (
          <div key={i} style={{ flex:1 }}>
            <div style={{ background:T.navyDeep, border:`1.5px solid ${c.color}50`, borderRadius:10, padding:"12px 10px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:T.slate, marginBottom:4 }}>{c.label}</div>
              <div style={{ fontSize:10, color:`${c.color}90`, marginBottom:10 }}>{c.sublabel}</div>
              <div style={{ fontSize:10, color:T.slate, textDecoration:"line-through", marginBottom:4,
                opacity:play?1:0, transition:play?`opacity 0.3s ease ${c.delay}s`:"none" }}>¥1,000,000</div>
              <div style={{ fontSize:18, fontWeight:900, color:c.color, lineHeight:1.2,
                opacity:play?1:0, transition:play?`opacity 0.5s ease ${c.delay+0.3}s`:"none" }}>{c.endVal}</div>
              <div style={{ fontSize:10, color:c.color, marginTop:4, fontWeight:700,
                opacity:play?1:0, transition:play?`opacity 0.5s ease ${c.delay+0.4}s`:"none" }}>{c.subVal}</div>
              <div style={{ fontSize:10, color:T.offWhite, marginTop:8, lineHeight:1.4,
                opacity:play?1:0, transition:play?`opacity 0.5s ease ${c.delay+0.6}s`:"none" }}>{c.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, padding:"10px 12px", background:T.navyDeep, borderRadius:8,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.6s":"none",
        fontSize:12, color:T.offWhite, lineHeight:1.5 }}>
        "Doing nothing" is not safe. It just{" "}
        <span style={{ color:T.amber, fontWeight:700 }}>feels</span> safe.
      </div>
    </div>
  );
}

// ── WB: Debt Infographic ──────────────────────────────────────
function WB_Debt({ play, debtRate, debtBalance }) {
  const debtCost = Math.round(debtBalance * debtRate / 100);
  const mktEarn  = Math.round(debtBalance * 0.07);
  const isHigh   = debtRate > 7;
  const maxVal   = Math.max(debtCost, mktEarn, 1);
  const debtBarH = Math.round((debtCost / maxVal) * 90);
  const mktBarH  = Math.round((mktEarn  / maxVal) * 90);
  const gap      = debtCost - mktEarn;

  return (
    <div style={{ padding:"8px 0" }}>

      {/* Row 1: Bucket metaphor */}
      <div style={{ opacity:play?1:0, transition:play?"opacity 0.5s ease 0.1s":"none", marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.slate, textAlign:"center", marginBottom:10, textTransform:"uppercase", letterSpacing:0.8 }}>
          Investing = filling a bucket
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div style={{ fontSize:40 }}>🪣</div>
              <div style={{ position:"absolute", bottom:2, right:-4, fontSize:18,
                opacity:play?1:0, transition:play?"opacity 0.4s ease 0.6s":"none" }}>🕳️</div>
            </div>
            <div style={{ fontSize:11, color:T.red, fontWeight:700, marginTop:4 }}>High-interest debt</div>
            <div style={{ fontSize:10, color:T.slate, marginTop:2, lineHeight:1.4 }}>Bucket with a hole<br/>Seal the hole first</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", fontSize:20, color:T.slate }}>→</div>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:40 }}>🪣</div>
            <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginTop:4 }}>No debt / Low rate</div>
            <div style={{ fontSize:10, color:T.slate, marginTop:2, lineHeight:1.4 }}>Solid bucket<br/>Water keeps filling</div>
          </div>
        </div>
      </div>

      <div style={{ height:1, background:T.navyMid, marginBottom:16 }} />

      {/* Row 2: Bar chart */}
      <div style={{ fontSize:11, color:T.slate, textAlign:"center", marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
        {fmtFull(debtBalance)} — annual cost comparison
      </div>
      <div style={{ display:"flex", gap:16, alignItems:"flex-end", height:110, marginBottom:8, padding:"0 16px" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
          <div style={{ fontSize:13, fontWeight:900, color:isHigh?T.red:T.amber, marginBottom:4,
            opacity:play?1:0, transition:play?"opacity 0.4s ease 0.9s":"none" }}>
            {fmtFull(debtCost)}/yr
          </div>
          <div style={{ width:"100%", borderRadius:"6px 6px 0 0",
            background:isHigh?`${T.red}70`:`${T.amber}70`,
            border:`2px solid ${isHigh?T.red:T.amber}`,
            height:play?`${debtBarH}%`:"0%",
            transition:play?"height 0.7s ease 0.4s":"none",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:16, opacity:play?1:0, transition:play?"opacity 0.3s ease 0.8s":"none" }}>💸</span>
          </div>
          <div style={{ fontSize:10, color:T.slate, marginTop:6, textAlign:"center", lineHeight:1.3 }}>
            {debtRate}% debt<br/>cost (your loss)
          </div>
        </div>

        <div style={{ fontSize:12, fontWeight:900, color:T.slate, paddingBottom:30 }}>VS</div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
          <div style={{ fontSize:13, fontWeight:900, color:T.teal, marginBottom:4,
            opacity:play?1:0, transition:play?"opacity 0.4s ease 1.1s":"none" }}>
            {fmtFull(mktEarn)}/yr
          </div>
          <div style={{ width:"100%", borderRadius:"6px 6px 0 0",
            background:`${T.teal}70`, border:`2px solid ${T.teal}`,
            height:play?`${mktBarH}%`:"0%",
            transition:play?"height 0.7s ease 0.7s":"none",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:16, opacity:play?1:0, transition:play?"opacity 0.3s ease 1.0s":"none" }}>📈</span>
          </div>
          <div style={{ fontSize:10, color:T.slate, marginTop:6, textAlign:"center", lineHeight:1.3 }}>
            Market avg return<br/>(7%/yr est.)
          </div>
        </div>
      </div>

      {/* Row 3: Verdict */}
      {isHigh ? (
        <div style={{ padding:"12px 14px", borderRadius:10,
          background:`${T.red}15`, border:`1.5px solid ${T.red}50`,
          opacity:play?1:0, transition:play?"opacity 0.5s ease 1.4s":"none",
          display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:26, flexShrink:0 }}>⚠️</span>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:T.red, marginBottom:3 }}>
              Debt costs you {fmtFull(gap)} more per year
            </div>
            <div style={{ fontSize:11, color:T.offWhite, lineHeight:1.5 }}>
              Paying this off ={" "}
              <span style={{ color:T.amber, fontWeight:700 }}>a guaranteed {debtRate}% risk-free return.</span>
              {" "}No stock can promise that.
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding:"12px 14px", borderRadius:10,
          background:`${T.teal}15`, border:`1.5px solid ${T.teal}50`,
          opacity:play?1:0, transition:play?"opacity 0.5s ease 1.4s":"none",
          display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:26, flexShrink:0 }}>✅</span>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:T.teal, marginBottom:3 }}>
              Low rate — market return wins
            </div>
            <div style={{ fontSize:11, color:T.offWhite, lineHeight:1.5 }}>
              {debtRate}% is below our 7% threshold. You can invest alongside repayment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── WB: Cushion ───────────────────────────────────────────────
function WB_Cushion({ play, months }) {
  const ok = months >= 3;
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.slate, marginBottom:14, textTransform:"uppercase", letterSpacing:0.8 }}>
        Emergency fund coverage
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        {[1,2,3,4,5,6].map((m,i) => (
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <div style={{ height:50, borderRadius:6,
              background:play?(months>=m?(m<=3?T.amber:T.teal):T.navyDeep):T.navyDeep,
              border:`1.5px solid ${m<=3?T.amber:T.teal}50`,
              transition:play?`background 0.4s ease ${0.2*m}s`:"none",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:11, fontWeight:700,
                color:play&&months>=m?T.white:T.slate,
                transition:play?`color 0.4s ease ${0.2*m}s`:"none" }}>{m}</span>
            </div>
            <div style={{ fontSize:9, color:T.slate, marginTop:4 }}>mo</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 12px", borderRadius:8,
        background:ok?`${T.teal}15`:`${T.amber}15`,
        border:`1px solid ${ok?T.teal:T.amber}40`,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.4s":"none",
        fontSize:12, color:T.offWhite, lineHeight:1.5 }}>
        {ok
          ? `✓ ${months.toFixed(1)} months covered. Market drops? Job loss? Your investments stay untouched.`
          : `⚠ ${months.toFixed(1)} of 3 months. One emergency forces you to sell at the worst time.`
        }
      </div>
    </div>
  );
}

// ── WB Panel wrapper ──────────────────────────────────────────
function WBPanel({ title, color, children }) {
  const [play, setPlay] = useState(false);
  const [played, setPlayed] = useState(false);
  const toggle = () => {
    setPlay(false);
    setTimeout(() => { setPlay(true); setPlayed(true); }, 60);
  };
  return (
    <div style={{ background:T.navyDeep, border:`1px solid ${color}35`, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:1 }}>
          📋 {title}
        </div>
        <button onClick={toggle} style={{ background:`${color}20`, border:`1px solid ${color}50`,
          borderRadius:20, padding:"4px 14px", color, fontSize:11, fontWeight:700, cursor:"pointer" }}>
          {!played ? "▶ Draw it" : "↺ Replay"}
        </button>
      </div>
      {typeof children === "function" ? children(play) : children}
    </div>
  );
}

// ── Emotion profiles ──────────────────────────────────────────
const EMOTIONS = [
  {
    id:"curious", emoji:"🔍", label:"Curious",
    sublabel:"I want to start but don't know where",
    color:T.teal,
    headline:"That curiosity is already worth money.",
    subhead:"Here's exactly what one year of waiting costs you.",
    facts:[],
    stats:[
      { label:"Invest ¥10,000/month starting today", value:"~¥5.2M+", sub:"in 20 years at the market's 7% historical average", color:T.teal },
      { label:"Wait just one more year to figure it out", value:"−~¥500,000", sub:"permanently lost — compounding you can never get back", color:T.red },
    ],
    conclusion:"The cost of waiting is not zero. Every month spent getting ready is a month your money isn't compounding. You don't need to know everything. You just need to know if your foundation is ready — that's what we check next.",
    cta:"Show me if I'm ready →",
    WB: WB_Curious,
  },
  {
    id:"ashamed", emoji:"😔", label:"Behind",
    sublabel:"I feel guilty and late to the game",
    color:T.purple,
    headline:"You're not behind. You're being set up to feel that way.",
    subhead:"Here's who profits from your shame — and the real math.",
    facts:[
      { icon:"📊", text:"Financial literacy was never taught in school — by design. The system profits from you staying a consumer, not becoming a builder." },
      { icon:"💸", text:"'You should have started at 22' headlines keep you anxious and clicking — not building the quiet, boring, automated portfolio that actually works." },
    ],
    stats:[
      { label:"¥20,000/month starting at age 35", value:"~¥24.3M", sub:"by age 65 at 7%. Starting late still beats never starting.", color:T.purple },
    ],
    conclusion:"The shame is the product. The moment you stop reacting to headlines designed to paralyze you and run the actual numbers — that's when you take back control.",
    cta:"Run my real numbers →",
    WB: WB_Behind,
  },
  {
    id:"cautious", emoji:"🤔", label:"Cautious",
    sublabel:"I move carefully when it comes to money",
    color:T.amber,
    headline:"Your caution is a strength. It's been aimed at the wrong target.",
    subhead:"Here's what actually made investing fail — it wasn't the market.",
    facts:[
      { icon:"⚠️", text:"Most people who tried and lost did one of three things: invested while carrying high-rate debt, needed the money back soon, or panic-sold during a dip. These are sequencing failures — not market failures." },
    ],
    stats:[
      { label:"S&P 500 — every 20-year holding period in history", value:"100% positive", sub:"Every single 20-year period has ended positive. The risk is not the market — it's not being structurally prepared to hold through dips.", color:T.teal },
    ],
    conclusion:"People who failed invested before their foundation was in place. We check two things first. Without those in order, investing is genuinely risky — not because of the market, but because of your personal balance sheet.",
    cta:"Show me what to check →",
    WB: WB_Cautious,
  },
  {
    id:"anxious", emoji:"😰", label:"Anxious",
    sublabel:"I'm scared of making the wrong move",
    color:T.blue,
    headline:"That fear is protecting you. But from the wrong thing.",
    subhead:"The 'safe' choice has a hidden price tag. Let's put a number on it.",
    facts:[
      { icon:"🧠", text:"Our brains weight losses twice as heavily as gains — it's evolutionary. A 10% dip feels catastrophic, a 10% gain feels ordinary. Financial media exploits this wiring every single day." },
      { icon:"🛡️", text:"The antidote to financial anxiety isn't knowing more — it's having a structure so clear that emotions have no entry point. That structure starts with two checks." },
    ],
    stats:[
      { label:"¥1,000,000 in a standard savings account", value:"−~¥30,000/yr real value", sub:"Inflation 3% vs savings rate 0.1% = guaranteed real loss every year. Doing nothing is not safe. It just feels safe.", color:T.red },
    ],
    conclusion:"We're not asking you to be brave. We're asking you to be structural. Once your foundation is solid, every decision becomes a rule — not a feeling. Let's build that structure now.",
    cta:"Build my structure →",
    WB: WB_Anxious,
  },
];

// ── 2. MOVE CORE LAYOUT AND HOOK LOGIC TO INTERNAL COMPONENT ──
function Lesson0Content() {
  const searchParams = useSearchParams();
  //const uid = searchParams.get("uid");
  //const uid = sessionStorage.getItem("knowvest_uid");
// ── FIX: Look at the URL first, fallback to memory storage ──
  const urlUid = searchParams.get("uid");
  const uid = urlUid || (typeof window !== "undefined" ? sessionStorage.getItem("knowvest_uid") : null);

  // Backup store it if we grabbed it from the URL
  useEffect(() => {
    if (urlUid && typeof window !== "undefined") {
      sessionStorage.setItem("knowvest_uid", urlUid);
    }
  }, [urlUid]);

  const [part, setPart]               = useState(0);
  const [emotion, setEmotion]         = useState(null);
  const [hasDebt, setHasDebt]         = useState(null);
  const [debtBalance, setDebtBalance] = useState(500000);
  const [debtRate, setDebtRate]       = useState(18);
  const [savings, setSavings]         = useState(150000);
  const [expenses, setExpenses]       = useState(200000);
  const topRef = useRef(null);

  async function completeLesson(outcome) {
    if (!uid) return;
    try {
      const ref = doc(db, "users", uid, "progress", "summary");
      const update = {
        level0: {
          status: "complete",
          outcome,
          completedAt: serverTimestamp(),
        }
      };
      if (outcome === "green") {
        update.lesson_1_2 = { status: "active", quizPassed: false, attempts: 0 };
      }
      await setDoc(ref, update, { merge: true });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
    //window.location.href = "https://project-0d07n.vercel.app/roadmap?uid=" + uid;
    //window.location.href = "https://project-0d07n.vercel.app/roadmap";
    // Inside completeLesson() change this line at the bottom:
    window.location.href = `https://project-0d07n.vercel.app/roadmap.html?uid=${uid}`;
  }

  const profile        = EMOTIONS.find(e => e.id === emotion);
  const monthsCovered  = savings / Math.max(expenses, 1);
  const cushionOk      = monthsCovered >= 3;
  const debtOk         = !hasDebt || debtRate <= 7;
  const passesAudit    = debtOk && cushionOk;
  const yearlyDebtCost = hasDebt ? Math.round(debtBalance * debtRate / 100) : 0;

  const auditScore = (() => {
    if (part < 2) return 0;
    let s = debtOk ? 50 : Math.max(0, 50-(debtRate-7)*2);
    if (part >= 3) s += cushionOk ? 50 : Math.min(45, (monthsCovered/3)*50);
    return Math.round(Math.min(100, s));
  })();
  const scoreColor = auditScore >= 80 ? T.teal : auditScore >= 40 ? T.amber : T.red;

  useEffect(() => { topRef.current?.scrollIntoView({ behavior:"smooth" }); }, [part]);

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, "users", uid, "progress", "summary");
    setDoc(ref, { level0: { status: "inprogress" } }, { merge: true }).catch(() => {});
  }, [uid]);

  const LABELS = ["The Mirror","The Wake-Up","Debt Audit","Cushion Audit","Your Verdict"];

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:T.navy,
      fontFamily:"'Inter', system-ui, sans-serif", color:T.white,
      padding:"0 16px 80px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ width:"100%", maxWidth:480 }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 14px" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:2, color:T.slate, textTransform:"uppercase", marginBottom:3 }}>
              Level 0
            </div>
            <div style={{ fontSize:17, fontWeight:800 }}>{LABELS[part]}</div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            {LABELS.map((_,i) => (
              <div key={i} style={{ height:4, width:i===part?22:8, borderRadius:2,
                background:i<part?T.teal:i===part?(profile?.color||T.teal):T.navyCard,
                transition:"all 0.4s" }} />
            ))}
          </div>
        </div>

        {/* Score bar */}
        {part >= 2 && (
          <div style={{ background:T.navyCard, borderRadius:12, padding:"12px 16px", marginBottom:14, border:`1px solid ${T.navyMid}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontSize:11, color:T.slate, letterSpacing:1, textTransform:"uppercase" }}>Foundation Score</span>
              <span style={{ fontSize:13, fontWeight:700, color:scoreColor }}>{auditScore}/100</span>
            </div>
            <div style={{ background:T.navy, borderRadius:3, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${auditScore}%`, background:scoreColor, borderRadius:3, transition:"width 0.6s ease, background 0.4s" }} />
            </div>
          </div>
        )}

        {/* ═══ PART 0: MIRROR ═══ */}
        {part === 0 && (
          <Fade>
            <div style={{ textAlign:"center", padding:"28px 0 20px" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🪞</div>
              <div style={{ fontSize:22, fontWeight:900, lineHeight:1.3, marginBottom:6 }}>
                Before we talk about money —
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:T.teal, lineHeight:1.3, marginBottom:16 }}>
                let's talk about where you are.
              </div>
              <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.7, maxWidth:340, margin:"0 auto 28px" }}>
                Every investor starts from a different emotional place.
                Where you start shapes how we teach you.
                Be honest — this isn't graded.
              </div>
            </div>
            <div style={{ fontSize:12, color:T.slate, textAlign:"center", marginBottom:12 }}>
              Right now, money makes me feel...
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:8 }}>
              {EMOTIONS.map(e => (
                <button key={e.id} onClick={() => setEmotion(e.id)} style={{
                  background:emotion===e.id?`${e.color}20`:T.navyCard,
                  border:`2px solid ${emotion===e.id?e.color:T.navyMid}`,
                  borderRadius:14, padding:"16px 10px", cursor:"pointer",
                  textAlign:"center", transition:"all 0.2s" }}>
                  <div style={{ fontSize:30, marginBottom:6 }}>{e.emoji}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:emotion===e.id?e.color:T.white, marginBottom:3 }}>{e.label}</div>
                  <div style={{ fontSize:11, color:T.slate, lineHeight:1.4 }}>{e.sublabel}</div>
                </button>
              ))}
            </div>
            <Btn disabled={!emotion} color={profile?.color||T.teal} onClick={() => setPart(1)}>
              This is me →
            </Btn>
          </Fade>
        )}

        {/* ═══ PART 1: WAKE-UP ═══ */}
        {part === 1 && profile && (
          <Fade>
            <Card borderColor={profile.color}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8,
                background:`${profile.color}18`, borderRadius:20, padding:"4px 12px", marginBottom:14 }}>
                <span style={{ fontSize:16 }}>{profile.emoji}</span>
                <span style={{ fontSize:11, fontWeight:700, color:profile.color, letterSpacing:1, textTransform:"uppercase" }}>
                  You said: {profile.label}
                </span>
              </div>
              <div style={{ fontSize:20, fontWeight:900, lineHeight:1.3, marginBottom:6 }}>{profile.headline}</div>
              <div style={{ fontSize:13, color:profile.color, fontWeight:600, marginBottom:16 }}>{profile.subhead}</div>

              <WBPanel title="Whiteboard" color={profile.color}>
                {(play) => <profile.WB play={play} />}
              </WBPanel>

              {profile.facts.map((f,i) => (
                <div key={i} style={{ background:T.navy, borderRadius:12, padding:"13px 14px", display:"flex", gap:12, marginBottom:10 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{f.icon}</span>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.65 }}>{f.text}</div>
                </div>
              ))}

              {profile.stats.map((s,i) => (
                <div key={i} style={{ background:T.navy, borderRadius:12, padding:"14px 16px", borderLeft:`3px solid ${s.color}`, marginBottom:10 }}>
                  <div style={{ fontSize:11, color:T.slate, marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>{s.label}</div>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, marginBottom:5 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:T.offWhite, lineHeight:1.5 }}>{s.sub}</div>
                </div>
              ))}

              <div style={{ background:`${profile.color}12`, border:`1px solid ${profile.color}35`,
                borderRadius:12, padding:"14px 16px", marginTop:4, marginBottom:14 }}>
                <div style={{ fontSize:13, color:T.white, lineHeight:1.7, fontStyle:"italic" }}>
                  "{profile.conclusion}"
                </div>
                <div style={{ fontSize:11, color:profile.color, marginTop:8, fontWeight:700 }}>— Knowvest</div>
              </div>
              <Btn color={profile.color} onClick={() => setPart(2)}>{profile.cta}</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 2: DEBT ═══ */}
        {part === 2 && (
          <Fade>
            <Card>
              <Pill color={T.red}>Audit Check 1 of 2</Pill>
              <div style={{ fontSize:21, fontWeight:900, marginBottom:6 }}>The Debt Check</div>
              <div style={{ fontSize:13, color:T.offWhite, marginBottom:16, lineHeight:1.6 }}>
                See why visually first — hit ▶ to draw it.
              </div>

              <WBPanel title="Why debt comes before investing" color={T.red}>
                {(play) => <WB_Debt play={play} debtRate={debtRate} debtBalance={debtBalance} />}
              </WBPanel>

              <div style={{ fontSize:13, color:T.offWhite, marginBottom:10, fontWeight:600 }}>
                Do you currently carry any debt with interest?
              </div>
              <div style={{ display:"flex", gap:10, marginBottom:18 }}>
                {[["Yes",true],["No — debt-free",false]].map(([label,val]) => (
                  <button key={String(val)} onClick={() => setHasDebt(val)} style={{
                    flex:1, padding:"13px 8px", borderRadius:10, cursor:"pointer",
                    border:`2px solid ${hasDebt===val?(val?T.red:T.teal):T.navyMid}`,
                    background:hasDebt===val?(val?`${T.red}22`:`${T.teal}22`):T.navyCard,
                    color:T.white, fontWeight:700, fontSize:14, transition:"all 0.2s" }}>
                    {label}
                  </button>
                ))}
              </div>

              {hasDebt === true && (
                <>
                  <Slider label="Total debt balance" value={debtBalance} onChange={setDebtBalance}
                    min={10000} max={5000000} step={10000} display={fmt(debtBalance)}
                    color={debtRate>7?T.red:T.teal} />
                  <Slider label="Average interest rate" value={debtRate} onChange={setDebtRate}
                    min={1} max={36} step={0.5} display={`${debtRate}%`}
                    color={debtRate>7?T.red:T.teal} />
                  <Insight color={debtRate>7?T.red:T.teal}>
                    {debtRate > 7
                      ? <>{debtRate}% debt costs you <strong style={{ color:T.red }}>{fmtFull(yearlyDebtCost)}/yr.</strong> Paying it off IS your highest-return investment right now.</>
                      : <>{debtRate}% is below the 7% threshold. Market returns can outpace it. Keep paying it down but you're clear to invest alongside it.</>
                    }
                  </Insight>
                </>
              )}
              {hasDebt === false && (
                <Insight color={T.teal}>
                  <strong style={{ color:T.teal }}>✓ Zero interest working against you.</strong> Every yen you invest compounds for you. Let's check your cash cushion next.
                </Insight>
              )}
              <Btn color={profile?.color||T.teal} disabled={hasDebt===null} onClick={() => setPart(3)}>
                Next: Check my cash cushion →
              </Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 3: CUSHION ═══ */}
        {part === 3 && (
          <Fade>
            <Card>
              <Pill color={T.amber}>Audit Check 2 of 2</Pill>
              <div style={{ fontSize:21, fontWeight:900, marginBottom:6 }}>The Cash Cushion</div>
              <Why color={T.amber} label="Why this is non-negotiable">
                The #1 reason people lose money in the market is not a bad investment choice.
                It's being <strong style={{ color:T.amber }}>forced to sell at the worst possible time</strong> — no cash buffer, urgent need.
                Your investment money must never be money you might need next month.
              </Why>

              <Slider label="Liquid savings (cash / HYSA)" value={savings} onChange={setSavings}
                min={0} max={3000000} step={10000} display={fmt(savings)}
                color={cushionOk?T.teal:T.amber} />
              <Slider label="Monthly living expenses" value={expenses} onChange={setExpenses}
                min={50000} max={1000000} step={10000} display={fmt(expenses)} color={T.slate} />

              <WBPanel title="Your Cushion Shield" color={cushionOk?T.teal:T.amber}>
                {(play) => <WB_Cushion play={play} months={monthsCovered} />}
              </WBPanel>

              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, color:T.slate }}>Runway if income stops today</span>
                  <span style={{ fontSize:14, fontWeight:800, color:cushionOk?T.teal:T.amber }}>
                    {monthsCovered.toFixed(1)} months
                  </span>
                </div>
                <div style={{ background:T.navy, borderRadius:4, height:10, overflow:"hidden", position:"relative" }}>
                  <div style={{ height:"100%", width:`${Math.min(100,(monthsCovered/6)*100)}%`,
                    background:cushionOk?T.teal:T.amber, borderRadius:4, transition:"width 0.5s ease" }} />
                  <div style={{ position:"absolute", top:0, left:"50%", width:2, height:"100%", background:`${T.white}30` }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.slate, marginTop:4 }}>
                  <span>¥0</span>
                  <span style={{ color:cushionOk?T.teal:T.amber }}>← 3 months min</span>
                  <span>6 months ideal</span>
                </div>
              </div>

              <Insight color={cushionOk?T.teal:T.amber}>
                {cushionOk
                  ? <><strong style={{ color:T.teal }}>✓ Cushion secured.</strong> {monthsCovered.toFixed(1)} months of runway — your investments stay untouched no matter what life throws at you.</>
                  : <><strong style={{ color:T.amber }}>⚠ You need {fmt(Math.ceil(3*expenses-savings))} more</strong> to reach 3 months. One emergency forces you to sell at the worst time. We close this gap first.</>
                }
              </Insight>
              <Btn color={profile?.color||T.teal} onClick={() => setPart(4)}>See my verdict →</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 4: VERDICT ═══ */}
        {part === 4 && (
          <Fade>
            {passesAudit && (
              <Card borderColor={T.teal}>
                <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                  <div style={{ fontSize:52, marginBottom:10 }}>🟢</div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.teal, marginBottom:6 }}>Your foundation is solid.</div>
                  <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.6, maxWidth:300, margin:"0 auto" }}>
                    You've done what most people skip entirely. Debt clean, cushion real. Now we build on it.
                  </div>
                </div>
                <Hr />
                <VRow icon="✓" color={T.teal} label="Debt check" value={hasDebt?`${debtRate}% — below threshold`:"Debt-free"} />
                <VRow icon="✓" color={T.teal} label="Emergency cushion" value={`${monthsCovered.toFixed(1)} months covered`} />
                <Btn color={T.teal} onClick={() => completeLesson("green")}>Unlock Level 1 →</Btn>
              </Card>
            )}

            {!debtOk && (
              <Card borderColor={T.red}>
                <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                  <div style={{ fontSize:52, marginBottom:10 }}>⚔️</div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.red, marginBottom:6 }}>You have a boss to defeat first.</div>
                  <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.6, maxWidth:300, margin:"0 auto" }}>
                    This isn't bad news. It's the clearest, highest-return move available to you right now.
                  </div>
                </div>
                <Hr />
                <WBPanel title="Why paying this off is your #1 investment" color={T.red}>
                  {(play) => <WB_Debt play={play} debtRate={debtRate} debtBalance={debtBalance} />}
                </WBPanel>
                <div style={{ background:`${T.red}15`, border:`1px solid ${T.red}40`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ fontSize:11, color:T.red, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Your current quest</div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.white, marginBottom:4 }}>⚔ Defeat the {debtRate}% Debt Boss</div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6 }}>
                    Direct every spare yen at this balance. When it's gone, return here. Level 1 will be waiting.
                  </div>
                </div>
                <VRow icon="✗" color={T.red} label="High-interest debt" value={`${debtRate}% — blocks Level 1`} />
                <VRow icon={cushionOk?"✓":"⚠"} color={cushionOk?T.teal:T.amber} label="Emergency cushion" value={cushionOk?`${monthsCovered.toFixed(1)} mo ✓`:"Still needed"} />
                <div style={{ display:"flex", gap:10, marginTop:14 }}>
                  <Btn color={T.red} style={{ flex:1 }} onClick={() => completeLesson("blocked_debt")}>Learn the strategy - Go back to lesson</Btn>
                  <Btn color={T.navyCard} style={{ flex:1, border:`1px solid ${T.slate}33` }} onClick={() => completeLesson("blocked_debt")}> Unlock Level 1 →</Btn>
                </div>
              </Card>
            )}

            {debtOk && !cushionOk && (
              <Card borderColor={T.amber}>
                <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                  <div style={{ fontSize:52, marginBottom:10 }}>🛡️</div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.amber, marginBottom:6 }}>Almost there. One wall left to build.</div>
                  <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.6, maxWidth:300, margin:"0 auto" }}>
                    Debt is clean. Now protect your future investments from bailing out your present self.
                  </div>
                </div>
                <Hr />
                <WBPanel title="Why the cushion comes first" color={T.amber}>
                  {(play) => <WB_Cushion play={play} months={monthsCovered} />}
                </WBPanel>
                <div style={{ background:`${T.amber}12`, border:`1px solid ${T.amber}40`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ fontSize:11, color:T.amber, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Your current quest</div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.white, marginBottom:4 }}>🛡 Build the {fmt(Math.ceil(3*expenses-savings))} Fortress</div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6 }}>
                    Open a High-Yield Savings Account. Automate transfers until you hit 3 months. Then come back — Level 1 unlocks immediately.
                  </div>
                </div>
                <VRow icon="✓" color={T.teal} label="Debt check" value={hasDebt?`${debtRate}% — clean`:"Debt-free"} />
                <VRow icon="⚠" color={T.amber} label="Emergency cushion" value={`${monthsCovered.toFixed(1)} of 3 months`} />
                <div style={{ display:"flex", gap:10, marginTop:14 }}>
                  <Btn color={T.amber} style={{ flex:1, color:T.navy }} onClick={() => completeLesson("blocked_no_fund")}>Build my cushion - back to roadmap</Btn>
                  <Btn color={T.navyCard} style={{ flex:1, border:`1px solid ${T.slate}33` }} onClick={() => completeLesson("blocked_no_fund")}>Unlock Level 1 →</Btn>
                </div>
              </Card>
            )}

            <button onClick={() => { setPart(0); setEmotion(null); setHasDebt(null); }} style={{
              display:"block", margin:"20px auto 0",
              background:"none", border:"none", color:T.slate, fontSize:12, cursor:"pointer", textDecoration:"underline" }}>
              ← Start over
            </button>
          </Fade>
        )}
      </div>
    </div>
  );
}

// ── 3. CLEAN WRAPPED DEFAULT EXPORT FOR NEXT.JS COMPILER ──
export default function Level0() {
  return (
    <Suspense fallback={
      <div style={{ background: T.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ color: T.slate, fontSize: 14 }}>Initializing Lesson 0 Layout...</div>
      </div>
    }>
      <Lesson0Content />
    </Suspense>
  );
}

// ── Shared components ─────────────────────────────────────────
function Fade({ children }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 40); return () => clearTimeout(t); }, []);
  return (
    <div style={{ opacity:show?1:0, transform:show?"none":"translateY(12px)", transition:"opacity 0.4s ease, transform 0.4s ease" }}>
      {children}
    </div>
  );
}
function Card({ children, borderColor }) {
  return (
    <div style={{ background:T.navyCard, borderRadius:16, padding:"20px 18px", marginBottom:16,
      border:`1px solid ${borderColor||T.navyMid}`, transition:"border-color 0.3s" }}>
      {children}
    </div>
  );
}
function Pill({ children, color }) {
  return (
    <div style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:1.5,
      textTransform:"uppercase", color, border:`1px solid ${color}`, borderRadius:6, padding:"3px 8px", marginBottom:12 }}>
      {children}
    </div>
  );
}
function Why({ children, color, label }) {
  return (
    <div style={{ background:T.navy, borderRadius:12, padding:"14px 16px", marginBottom:18, borderLeft:`3px solid ${color}` }}>
      <div style={{ fontSize:11, color, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</div>
      <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.7 }}>{children}</div>
    </div>
  );
}
function Insight({ children, color }) {
  return (
    <div style={{ background:T.navy, borderRadius:12, padding:"13px 14px", marginBottom:16,
      borderLeft:`3px solid ${color}`, fontSize:13, color:T.offWhite, lineHeight:1.65, transition:"border-color 0.3s" }}>
      {children}
    </div>
  );
}
function Slider({ label, value, onChange, min, max, step, display, color }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:13, color:T.slate }}>{label}</span>
        <span style={{ fontSize:16, fontWeight:800, color }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor:color, cursor:"pointer" }} />
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.slate, marginTop:2 }}>
        <span>{fmt(min)}</span><span>{fmt(max)}</span>
      </div>
    </div>
  );
}
function Hr() { return <div style={{ height:1, background:T.navyMid, margin:"14px 0 18px" }} />; }
function VRow({ icon, color, label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"10px 0", borderBottom:`1px solid ${T.navyMid}`, fontSize:13 }}>
      <span style={{ color:T.slate }}>{label}</span>
      <span style={{ color, fontWeight:700 }}>{icon} {value}</span>
    </div>
  );
}
function Btn({ children, onClick, color, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:"block", width:"100%", padding:"15px", marginTop:14, borderRadius:12, border:"none",
      background:disabled?T.navyMid:color,
      color:color===T.amber?T.navy:T.white,
      fontSize:15, fontWeight:800, cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?0.45:1, transition:"opacity 0.2s", ...style }}>
      {children}
    </button>
  );
}