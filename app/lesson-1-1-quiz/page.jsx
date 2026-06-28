"use client";
import { useState, useEffect, Suspense } from "react"; // 👈 Added Suspense
import { useSearchParams } from "next/navigation"; // 👈 Added navigation handles
import { initializeApp, getApps } from "firebase/app"; // 👈 Added Firebase hooks
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// ── FIREBASE STORAGE CONFIG ──
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
  purple:"#A78BFA", blue:"#60A5FA", slate:"#8DA0B3",
  white:"#F0F4F8", offWhite:"#C8D6E2", oxygen:"#38BDF8",
};

const yen  = (n) => n >= 1000000 ? "¥" + (n/1000000).toFixed(1) + "M" : n >= 1000 ? "¥" + (n/1000).toFixed(0) + "k" : "¥" + Math.round(n).toLocaleString();
const yenF = (n) => "¥" + Math.round(n).toLocaleString();
const c20  = (n) => yenF(Math.round(n * Math.pow(1.07, 20)));

const PERSONALITY_QS = [
  {
    q:"A ¥50,000 bonus just hit your account. First instinct?",
    choices:[
      { label:"Top up my Emergency Fund", icon:"🛸", score:2 },
      { label:"Invest it immediately",     icon:"🚀", score:1 },
      { label:"Treat myself — I earned this", icon:"🛍️", score:0 },
    ],
  },
  {
    q:"You find ¥3,000 in an old jacket pocket. What happens to it?",
    choices:[
      { label:"Add it to my savings",            icon:"🏦", score:2 },
      { label:"Leave it in my wallet for later", icon:"👜", score:1 },
      { label:"Spend it — it's found money",     icon:"🍜", score:0 },
    ],
  },
  {
    q:"Your expenses came in ¥20,000 under budget this month. You...",
    choices:[
      { label:"Transfer it to Emergency Fund",      icon:"🛸", score:2 },
      { label:"Let it sit in my bank account",      icon:"💤", score:1 },
      { label:"Upgrade something I've been eyeing", icon:"🛒", score:0 },
    ],
  },
];

const PERSONALITIES = [
  { id:"architect", minScore:5, icon:"🏛️", title:"The Architect", desc:"Your saving instinct is structural. You treat surplus money as a resource to deploy, not a reward to spend. This is the foundation of long-term wealth.", rate:0.20, bonus:200000, color:T.teal, bonusLabel:"Tank Bonus: +¥200,000" },
  { id:"builder",   minScore:3, icon:"🔧", title:"The Builder",   desc:"You have the instinct but one blind spot lets spending creep in. The habit is forming — you just need a hard rule to close the gap.", rate:0.15, bonus:100000, color:T.blue, bonusLabel:"Tank Bonus: +¥100,000" },
  { id:"grower",    minScore:0, icon:"🌱", title:"The Grower",    desc:"The saving habit isn't automatic yet — and that's exactly why you're here. The simulator will show you what building it looks like in practice.", rate:0.08, bonus:0, color:T.amber, bonusLabel:"No bonus — base tank only" },
];

const getPersonality = (score) => PERSONALITIES.find(p => score >= p.minScore) || PERSONALITIES[2];
const TIME_GAPS = [0, 2, 4, 1, 3, 2, 5, 8, 3, 6];

const EVENTS = [
  { id:1, icon:"🚗", tag:"Universal", tagColor:T.slate, title:"Car Breakdown", story:"You're driving to work Monday morning when your car dies on the expressway. Transmission failure. The mechanic needs payment today.", bill:180000, billLabel:"Repair bill", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Exactly right. This is what the Emergency Fund is for. Colony untouched and still compounding." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"¥180,000 withdrawn from the colony today costs you " + c20(180000) + " in 20-year compounding. The colony doesn't get torn down for a car repair." }, { label:"Put it on a credit card", icon:"💳", correct:false, explain:"Credit card interest at 18% adds ¥32,000 in year one alone. You'd be rebuilding a debt boss you already defeated in Level 0." } ], jessica:"The oxygen tank exists for exactly this moment. Car repairs, dentist bills — everyday emergencies your fund absorbs silently." },
  { id:2, icon:"🦷", tag:"Universal", tagColor:T.slate, title:"Emergency Root Canal", story:"Sharp tooth pain hits Friday night. By Saturday you need an emergency root canal plus a crown. The clinic wants payment upfront.", bill:95000, billLabel:"Dental bill", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Perfect. Health emergencies always take priority — and your colony didn't lose a single brick." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"¥95,000 from the colony costs you " + c20(95000) + " over 20 years. Health emergencies are exactly what the tank is for." }, { label:"Delay treatment to save up", icon:"⏳", correct:false, explain:"Delaying dental care turns a ¥95,000 problem into a ¥300,000+ extraction and implant — plus time off work. The tank exists so you never delay a health decision because of money." } ], jessica:"Medical emergencies feel urgent. That's exactly why you build the tank in advance — so when it hits, the decision is already made." },
  { id:3, icon:"🚙", tag:"Japan — Shakken", tagColor:T.amber, title:"Shakken Due (車検)", story:"Your mandatory biennial car inspection is due this month. New brakes, tires, and inspection fees. Legally required — no skipping it.", bill:120000, billLabel:"Shakken + repairs", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Good. Shakken is predictable — every 2 years. Your Emergency Fund covers it cleanly. Ideally it has its own sinking fund over time." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"Shakken is a known, recurring expense. Selling colony bricks for something this predictable is a sequencing error that costs you " + c20(120000) + " over 20 years." }, { label:"Skip it and keep driving", icon:"🚫", correct:false, explain:"Driving without a valid shakken is illegal in Japan. Your insurance becomes void and fines can exceed the inspection cost itself. There is no skipping this one." } ], jessica:"Japan has uniquely large predictable expenses — shakken, residence tax, health insurance adjustments. These should have their own sinking fund over time." },
  { id:4, icon:"📉", tag:"Market Event", tagColor:T.blue, title:"Market Drops 18%", story:"Your portfolio is down ¥340,000 from last month. Financial news is screaming 'crash incoming.' Everyone on social media is panic selling.", bill:null, billLabel:null, isMarket:true, choices:[ { label:"Do nothing — stay the course", icon:"🧘", correct:true, explain:"This is the rule. An 18% dip is a normal quarterly chapter. Your oxygen tank means you don't need to sell. History shows it always recovers." }, { label:"Sell now to stop the bleeding", icon:"📉", correct:false, explain:"Selling during a dip converts a temporary paper loss into a permanent capital loss. Every single historical dip has recovered. You just need to not need the money right now — which is exactly why the tank exists." }, { label:"Wait for the bottom, then rebuy", icon:"⏳", correct:false, explain:"Nobody has ever reliably timed the bottom — not retail investors, not hedge funds. Studies show missing just the 10 best market days in a decade cuts returns in half. The rule is simple: do nothing." } ], jessica:"This is exactly why we built the oxygen tank first. Because you don't need that money — you do nothing. The colony keeps building." },
  { id:5, icon:"✈️", tag:"Universal", tagColor:T.slate, title:"Family Emergency Flight", story:"A 2am call. A family member is seriously ill and you need to fly back home immediately. One-way flight, hotel, two weeks off work.", bill:280000, billLabel:"Travel + lost wages", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Right. Emotional emergencies are still emergencies. Your oxygen tank absorbs this. You focus on family — not finances." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"¥280,000 from the colony costs " + c20(280000) + " over 20 years. Your tank exists so money never competes with family in your worst moments." }, { label:"Take a personal loan", icon:"FIN", correct:false, explain:"A personal loan at 5–8% adds financial stress on top of emotional stress — and creates a new debt obligation right when your income may already be disrupted by time off work." } ], jessica:"The most important thing the oxygen tank does is remove financial decisions from emotional moments. When family calls, money should never be the question." },
  { id:6, icon:"💼", tag:"Universal", tagColor:T.slate, title:"Job Loss — 2 Months", story:"Your company announces restructuring. Your position is eliminated. One month severance. You need 2 months of expenses while job hunting.", bill:null, billLabel:null, isMarket:false, isDynamic:true, dynamicBillFn:(expenses) => expenses * 2, dynamicLabel:"2 months living expenses", choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"This is the core use case. Job loss is the #1 reason you built 3–6 months of emergency cash. Colony stays untouched and keeps compounding." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"Job losses and market downturns are correlated — they often happen simultaneously. Selling your colony during a downturn means selling at the lowest point. That's double damage you can never undo." }, { label:"Max out credit cards", icon:"💳", correct:false, explain:"Credit card debt at 18% on 2 months of expenses costs tens of thousands per year in interest. You'd be rebuilding the exact debt boss from Level 0 at the worst possible time." } ], jessica:"Job loss and market downturns are correlated. Without the oxygen tank, you sell your colony at rock bottom to survive. With it, you hold through the dip." },
  { id:7, icon:"🏠", tag:"Universal", tagColor:T.slate, title:"Apartment Deposit", story:"Your landlord isn't renewing your lease. New place found — first month, last month, and security deposit all due in 3 weeks.", bill:350000, billLabel:"Deposit + first/last month", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Correct — though note: moving costs are predictable. Ideally they have their own sinking fund. Emergency Fund covers it for now, but plan ahead for next time." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"¥350,000 from the colony costs " + c20(350000) + " over 20 years. Moving costs are predictable enough to plan for — they belong in a sinking fund, not funded by colony bricks." }, { label:"Borrow from family", icon:"👨‍👩‍👦", correct:false, explain:"Borrowing from family adds relationship risk to financial stress. When repayment gets delayed — and it often does — it creates tension that outlasts the financial problem itself." } ], jessica:"Some expenses are predictable enough for a separate sinking fund — moving, travel, big purchases. This keeps your Emergency Fund reserved for true surprises." },
  { id:8, icon:"📊", tag:"Japan — Tax Season", tagColor:T.amber, title:"Tax Underpayment Surprise", story:"It's June. Your city tax bill arrives ¥85,000 higher than expected — a common shock for expats in Japan. Due in 3 weeks.", bill:85000, billLabel:"Tax underpayment", isMarket:false, choices:[ { label:"Use my Emergency Fund", icon:"🛸", correct:true, needsTank:true, explain:"Right call. Tax surprises in Japan are common for expats — especially the first few years. Emergency Fund absorbs this in 24 hours. Colony intact." }, { label:"Sell some investments", icon:"🚀", correct:false, explain:"¥85,000 from the colony costs " + c20(85000) + " over 20 years. This is a classic oxygen-tank-sized expense — small enough to feel manageable, but the compounding cost is real." }, { label:"Request a payment extension", icon:"📋", correct:false, explain:"Japan's tax office expects on-time payment. Extensions can trigger penalties and interest that exceed the original underpayment amount. Your tank handles this cleanly." } ], jessica:"Japan's tax system can be opaque for expats. Residence tax, health insurance adjustments arrive as lump sums. Build awareness of these into your annual financial calendar." },
  { id:9, icon:"🚀", tag:"Market Event", tagColor:T.blue, title:"Market Surges 22% — Chase It?", story:"Your portfolio is up ¥420,000 this quarter. A colleague moved his entire Emergency Fund into stocks and made a killing. You feel left behind.", bill:null, billLabel:null, isMarket:true, isGreed:true, choices:[ { label:"Do nothing — protect the rule", icon:"🧘", correct:true, explain:"Discipline wins. Your colony is already up 22%. Moving the oxygen tank into the market means the next emergency destroys the colony instead of being absorbed by the tank." }, { label:"Move Emergency Fund into market", icon:"📈", correct:false, explain:"The moment your tank is empty, every future emergency becomes a forced colony sell. One medical bill, one job shock — and you're selling investments at whatever price the market offers that day." }, { label:"Take a loan to invest more", icon:"💸", correct:false, explain:"Leveraged investing amplifies losses as much as gains. A 22% gain on borrowed money feels incredible. A 22% loss on borrowed money means you owe more than your portfolio is worth." } ], jessica:"The greed trap is the mirror of the fear trap. Both lead to the same mistake — breaking the rule. Ask your colleague what happens when the market drops 20% and his emergency fund is gone." },
  { id:10, icon:"🌊", tag:"Final Event — Japan", tagColor:T.red, title:"Typhoon Damages Your Home", story:"A powerful typhoon hits. Ceiling collapse, ruined belongings, 3 months of temporary housing needed. Your renter's insurance has a gap and won't cover the full amount.", bill:1200000, billLabel:"Repairs + temporary housing", isMarket:false, isBoss:true, choices:[ { label:"Emergency Fund + don't sell investments", icon:"🛸", correct:true, needsTank:true, explain:"Right instinct. Your Emergency Fund covers what it can. The investments stay untouched — even here. The gap between your tank and this bill is exactly what Level 4 is about." }, { label:"Sell investments to cover the gap", icon:"🚀", correct:false, explain:"Even at ¥1.2M, selling the colony is not the answer. The gap between your tank and this bill is what income protection insurance exists to cover — which is exactly what Level 4 teaches." }, { label:"Take a large personal loan", icon:"🏦", correct:false, explain:"A large loan at your most financially vulnerable moment creates a debt burden right when your income may be disrupted by displacement. This is insurance territory — not loan territory." } ], jessica:"" }
];

const monthLabel = (total) => {
  if (total < 12) return total + (total === 1 ? " month" : " months");
  const y = Math.floor(total/12);
  const m = total % 12;
  if (m === 0) return y + (y === 1 ? " year" : " years");
  return y + (y === 1 ? " year " : " years ") + m + (m === 1 ? " month" : " months");
};

function QuizContent() {
  const searchParams = useSearchParams();
  // ── AUTH LINK CHANNELS ──
  const urlUid = searchParams.get("uid");
  const uid = urlUid || (typeof window !== "undefined" ? sessionStorage.getItem("knowvest_uid") : null);

  const [screen, setScreen]           = useState("partA");
  const [pqIdx, setPqIdx]             = useState(0);
  const [pScore, setPScore]           = useState(0);
  const [pChosen, setPChosen]         = useState(null);
  const [personality, setPersonality] = useState(null);
  const [income, setIncome]           = useState(350000);
  const [expenses, setExpenses]       = useState(200000);
  const [idx, setIdx]                 = useState(0);
  const [lives, setLives]             = useState(3);
  const [score, setScore]             = useState(0);
  const [tank, setTank]               = useState(0);
  const [startTank, setStartTank]     = useState(0);
  const [chosen, setChosen]           = useState(null);
  const [history, setHistory]         = useState([]);
  const [gameOver, setGameOver]       = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [monthsElapsed, setMonthsElapsed] = useState(0);
  const [existingAttempts, setExistingAttempts] = useState(0);

  useEffect(() => {
    if (urlUid && typeof window !== "undefined") {
      sessionStorage.setItem("knowvest_uid", urlUid);
    }
    if (uid) {
      // Look up previous attempts to properly increment them
      const ref = doc(db, "users", uid, "progress", "summary");
      getDoc(ref).then(snap => {
        if (snap.exists() && snap.data().lesson_1_2) {
          setExistingAttempts(snap.data().lesson_1_2.attempts || 0);
        }
      }).catch(e => console.error(e));
    }
  }, [urlUid, uid]);

  const ev     = EVENTS[idx];
  const isLast = idx === EVENTS.length - 1;
  const tankEmpty = tank <= 0;
  const evBill      = ev.isDynamic ? ev.dynamicBillFn(expenses) : ev.bill;
  const evBillLabel = ev.isDynamic ? ev.dynamicLabel : ev.billLabel;

  const pickPQ = (choice) => {
    if (pChosen) return;
    setPChosen(choice);
  };

  const nextPQ = () => {
    const newScore = pScore + (pChosen ? pChosen.score : 0);
    if (pqIdx < PERSONALITY_QS.length - 1) {
      setPScore(newScore);
      setPqIdx(i => i + 1);
      setPChosen(null);
    } else {
      setPersonality(getPersonality(newScore));
      setPScore(newScore);
      setScreen("personality");
    }
  };

  const startSim = () => {
    const baseTank = expenses * 3 + personality.bonus;
    setTank(baseTank);
    setStartTank(baseTank);
    setShowTimestamp(TIME_GAPS[0] > 0);
    setMonthsElapsed(0);
    setScreen("sim");
  };

  const dismissTimestamp = () => {
    const gap = TIME_GAPS[idx];
    const monthlySavings = Math.round(income * personality.rate);
    const refill = gap * monthlySavings;
    setTank(t => Math.min(startTank, t + refill));
    setMonthsElapsed(m => m + gap);
    setShowTimestamp(false);
  };

  const pick = (choice) => {
    if (chosen || showTimestamp) return;
    if (choice.needsTank && tankEmpty) return;
    const isCorrect = choice.correct;
    const newLives  = isCorrect ? lives : lives - 1;
    const newScore  = isCorrect ? score + 1 : score;
    const newTank   = (isCorrect && evBill) ? Math.max(0, tank - evBill) : tank;
    setChosen(choice);
    setScore(newScore);
    setTank(newTank);
    if (!isCorrect) setLives(newLives);
    setHistory(h => [...h, { icon:ev.icon, title:ev.title, correct:isCorrect, label:choice.label }]);
    if (!isCorrect && newLives <= 0) {
      setGameOver(true);
      saveQuizOutcome(false, newScore);
    }
  };

  const next = () => {
    if (gameOver || isLast) { 
      const passed = lives > 0 && score + (chosen?.correct ? 0 : 0) >= 7;
      saveQuizOutcome(passed, score);
      setScreen("result"); 
      return; 
    }
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setChosen(null);
    setShowTimestamp(TIME_GAPS[nextIdx] > 0);
  };

  // ── SAVE PROGRESS EXPLICITLY TO FIRESTORE ──
  async function saveQuizOutcome(passed, finalScore) {
    if (!uid) return;
    try {
      const ref = doc(db, "users", uid, "progress", "summary");
      const nextAttempts = existingAttempts + 1;
      
      const update = {
        lesson_1_2: {
          status: passed ? "complete" : "failed",
          quizPassed: passed,
          attempts: nextAttempts,
          lastScore: `${finalScore}/10`,
          completedAt: serverTimestamp()
        }
      };

      // If passed successfully, illuminate Lesson 1-3 as Active on the dashboard
      if (passed) {
        update.lesson_1_3 = { status: "active", quizPassed: false, attempts: 0 };
      }

      await setDoc(ref, update, { merge: true });
      setExistingAttempts(nextAttempts);
    } catch (e) {
      console.error("Firestore database update failure:", e);
    }
  }

  function routeToDashboard() {
    window.location.href = `https://project-0d07n.vercel.app/roadmap.html?uid=${uid}`;
  }

  if (screen === "partA") {
    const q = PERSONALITY_QS[pqIdx];
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <div style={{ fontSize:10, color:T.slate, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Lesson 1-2 · Before We Begin</div>
          <div style={{ fontSize:18, fontWeight:800 }}>Saving Instinct Check</div>
        </div>
        <div style={{ display:"flex", gap:5, marginBottom:16 }}>
          {PERSONALITY_QS.map((_,i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i < pqIdx ? T.teal : i === pqIdx ? T.slate : T.navyCard }} />
          ))}
        </div>
        <Box>
          <div style={{ fontSize:11, color:T.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Question {pqIdx+1} of 3</div>
          <div style={{ fontSize:18, fontWeight:800, lineHeight:1.35, marginBottom:18 }}>{q.q}</div>
          {q.choices.map((c,i) => {
            const isPicked = pChosen && pChosen.label === c.label;
            return (
              <button key={i} onClick={() => pickPQ(c)} disabled={!!pChosen} style={{ width:"100%", background: isPicked ? T.teal + "25" : T.navyDeep, border:"2px solid " + (isPicked ? T.teal : T.navyMid), borderRadius:12, padding:"13px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10, cursor: pChosen ? "default" : "pointer", textAlign:"left", transition:"all 0.2s" }}>
                <span style={{ fontSize:20 }}>{c.icon}</span>
                <span style={{ fontSize:13, color:T.white, fontWeight:600 }}>{c.label}</span>
              </button>
            );
          })}
          {pChosen && <Btn color={T.teal} onClick={nextPQ}>{pqIdx < PERSONALITY_QS.length - 1 ? "Next Question →" : "See My Saving Profile →"}</Btn>}
        </Box>
      </Wrap>
    );
  }

  if (screen === "personality") {
    const p = personality;
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <div style={{ fontSize:10, color:T.slate, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Your Saving Profile</div>
          <div style={{ fontSize:18, fontWeight:800 }}>The Result</div>
        </div>
        <Box borderColor={p.color}>
          <div style={{ textAlign:"center", padding:"12px 0 18px" }}>
            <div style={{ fontSize:52, marginBottom:10 }}>{p.icon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:p.color, marginBottom:6 }}>{p.title}</div>
            <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.7, maxWidth:300, margin:"0 auto" }}>{p.desc}</div>
          </div>
          <div style={{ background:T.navy, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
            {[
              ["Monthly savings rate", Math.round(p.rate*100) + "% of income", p.color],
              ["Tank bonus", p.bonus > 0 ? "+" + yen(p.bonus) : "None", p.bonus > 0 ? T.teal : T.slate],
            ].map(([label, val, color], i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom: i < 1 ? "1px solid " + T.navyMid : "none" }}>
                <span style={{ fontSize:12, color:T.slate }}>{label}</span>
                <span style={{ fontSize:14, fontWeight:900, color }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ background:p.color + "12", border:"1px solid " + p.color + "40", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
            <div style={{ fontSize:12, color:T.offWhite, lineHeight:1.65 }}>Your saving personality determines how fast your Emergency Fund refills between life events. The stronger your saving instinct, the more resilient your tank.</div>
          </div>
          <Btn color={p.color} onClick={() => setScreen("partB")}>Set Up My Numbers →</Btn>
        </Box>
      </Wrap>
    );
  }

  if (screen === "partB") {
    const monthlySavings = Math.round(income * personality.rate);
    const baseTank = expenses * 3 + personality.bonus;
    return (
      <Wrap>
        <div style={{ padding:"20px 0 14px" }}>
          <div style={{ fontSize:10, color:T.slate, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Lesson 1-2 · Setup</div>
          <div style={{ fontSize:18, fontWeight:800 }}>Your Numbers</div>
        </div>
        <Box>
          <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.65, marginBottom:18 }}>Your simulation is personalised. Set your monthly income and expenses — your Emergency Fund and refill rate are calculated from your real numbers.</div>
          <SliderField label="Monthly take-home income" value={income} onChange={setIncome} min={150000} max={1000000} step={10000} display={yen(income)} color={T.teal} />
          <SliderField label="Monthly living expenses" value={expenses} onChange={setExpenses} min={80000} max={600000} step={10000} display={yen(expenses)} color={T.slate} />
          <div style={{ background:T.navyDeep, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontSize:11, color:T.slate, textTransform:"uppercase", letterSpacing:0.8, marginBottom:12 }}>Your simulation parameters</div>
            {[
              ["🛸", "Starting Emergency Fund", yenF(baseTank), T.oxygen],
              ["📅", "Coverage", (baseTank/Math.max(expenses,1)).toFixed(1) + " months", T.teal],
              ["💰", "Monthly savings (" + Math.round(personality.rate*100) + "% — " + personality.title + ")", yen(monthlySavings) + "/mo", personality.color],
              ["🎁", "Personality bonus", personality.bonus > 0 ? "+" + yen(personality.bonus) : "None", personality.bonus > 0 ? T.teal : T.slate],
            ].map(([icon, label, val, color], i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom: i < 3 ? "1px solid " + T.navyMid : "none" }}>
                <span style={{ fontSize:11, color:T.slate }}>{icon} {label}</span>
                <span style={{ fontSize:13, fontWeight:800, color }}>{val}</span>
              </div>
            ))}
          </div>
          <Btn color={T.teal} onClick={startSim}>Launch Mission →</Btn>
        </Box>
      </Wrap>
    );
  }

  if (screen === "result") {
    const won     = lives > 0 && score >= 7;
    const partial = lives > 0 && score >= 5;
    const verdictColor = won ? T.teal : partial ? T.amber : T.red;
    const verdictIcon  = won ? "🏆" : partial ? "🛸" : "💥";
    const verdictTitle = won ? "Colony Survived!" : partial ? "Colony Damaged" : "Colony Collapsed";
    const verdictMsg   = won
      ? "You protected the oxygen tank, held through every market event, and never touched the colony. This is the discipline that builds long-term wealth."
      : partial
      ? "You understand the concept — but a few bucket mix-ups put the colony at risk. Review the events below."
      : "The colony collapsed. Every mistake has a real-world cost. The good news: you made them here, not out there. Run it again.";
    const jessicaQ = won
      ? "The rule works because you worked the rule. You never mixed the buckets and held through market events without flinching."
      : partial
      ? "Understanding and executing under pressure are different skills. Review the events you got wrong — those are the ones that will hit you in real life."
      : "The colony collapsed — and now you know why. Run it again. The rule is non-negotiable.";
    return (
      <Wrap>
        <Box borderColor={verdictColor}>
          <div style={{ textAlign:"center", padding:"8px 0 16px" }}>
            <div style={{ fontSize:52 }}>{verdictIcon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:verdictColor, margin:"8px 0 6px" }}>{verdictTitle}</div>
            <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6, marginBottom:14 }}>{verdictMsg}</div>
            <div style={{ background:T.navy, borderRadius:"50%", width:80, height:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"3px solid " + verdictColor, margin:"0 auto 12px" }}>
              <div style={{ fontSize:22, fontWeight:900, color:verdictColor }}>{score}/10</div>
              <div style={{ fontSize:10, color:T.slate }}>correct</div>
            </div>
            <div>{[1,2,3].map(i => <span key={i} style={{ fontSize:18 }}>{i <= lives ? "❤️" : "🖤"}</span>)}</div>
            <div style={{ fontSize:12, color:T.slate, marginTop:6 }}>Simulated {monthLabel(monthsElapsed)} of life</div>
          </div>
        </Box>
        <Box>
          <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Jessica's Verdict</div>
          <div style={{ fontSize:13, color:T.white, lineHeight:1.7, fontStyle:"italic" }}>"{jessicaQ}"</div>
          <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginTop:8 }}>— Jessica Inskip</div>
        </Box>
        <Box>
          <div style={{ fontSize:11, color:T.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Mission Debrief</div>
          {history.map((h,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid " + T.navyMid }}>
              <span style={{ fontSize:18 }}>{h.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700 }}>{h.title}</div>
                <div style={{ fontSize:11, color:T.slate }}>{h.label}</div>
              </div>
              <span style={{ fontSize:16 }}>{h.correct ? "✅" : "❌"}</span>
            </div>
          ))}
        </Box>
        <div style={{ display:"flex", gap:10 }}>
          {/* INTERACTIVE RETRY ROUTE WITH STATE RESET instead of reload alerts */}
          <Btn color={T.amber} style={{ flex:1 }} onClick={() => {
            setIdx(0); setLives(3); setScore(0); setChosen(null); setHistory([]); setGameOver(false); setShowTimestamp(true); setMonthsElapsed(0);
            const baseTank = expenses * 3 + personality.bonus; setTank(baseTank); setScreen("sim");
          }}>🔄 Retry Quiz</Btn>
          <Btn color={T.teal} style={{ flex:1 }} onClick={routeToDashboard}>Return to Dashboard →</Btn>
        </div>
      </Wrap>
    );
  }

  const evBorderColor = ev.isBoss ? T.red : ev.isMarket ? T.blue : ev.isGreed ? T.amber : T.navyMid;

  return (
    <Wrap>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0 10px" }}>
        <div style={{ fontSize:10, color:T.slate, letterSpacing:1.5, textTransform:"uppercase" }}>Event {idx+1} of 10</div>
        <div>{[1,2,3].map(i => <span key={i} style={{ fontSize:16 }}>{i <= lives ? "❤️" : "🖤"}</span>)}</div>
      </div>
      <div style={{ background:T.navyCard, borderRadius:4, height:6, marginBottom:12, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:4, background:T.teal, width:(idx/10*100) + "%", transition:"width 0.4s" }} />
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <div style={{ flex:2, background:T.navyCard, borderRadius:10, padding:"10px 12px", border:"1px solid " + T.navyMid }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:10, color:T.slate }}>🛸 Oxygen Tank</span>
            <span style={{ fontSize:12, fontWeight:800, color: tankEmpty ? T.red : tank > startTank*0.3 ? T.oxygen : T.amber }}>{tankEmpty ? "EMPTY" : yen(tank)}</span>
          </div>
          <div style={{ background:T.navy, borderRadius:3, height:5, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:3, background: tankEmpty ? T.red : tank > startTank*0.3 ? T.oxygen : T.amber, width: Math.min(100,(tank/Math.max(startTank,1))*100) + "%", transition:"width 0.5s" }} />
          </div>
          {tankEmpty && <div style={{ fontSize:10, color:T.red, marginTop:3, fontWeight:700 }}>⚠ Tank empty — Emergency Fund locked</div>}
        </div>
        <div style={{ flex:1, background:T.navyCard, borderRadius:10, padding:"10px", textAlign:"center", border:"1px solid " + T.navyMid }}>
          <div style={{ fontSize:10, color:T.slate }}>Score</div>
          <div style={{ fontSize:18, fontWeight:900, color:T.teal }}>{score}/10</div>
        </div>
      </div>

      {showTimestamp && !gameOver && (
        <Box borderColor={T.teal}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>⏱</div>
            <div style={{ fontSize:13, color:T.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Time passes...</div>
            <div style={{ fontSize:26, fontWeight:900, color:T.teal, marginBottom:4 }}>{monthLabel(gap)} later</div>
            <div style={{ fontSize:12, color:T.slate, marginBottom:16 }}>Month {monthsElapsed + gap} of your simulation</div>
            <div style={{ background:T.navy, borderRadius:12, padding:"14px", marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.slate, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>While time passed...</div>
              {[
                ["Monthly savings (" + Math.round(personality.rate*100) + "% rate)", yen(monthlySavings) + "/mo", T.teal],
                ["Months passed", "× " + gap, T.teal],
              ].map(([label, val, color], i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom: i < 1 ? "1px solid " + T.navyMid : "none" }}>
                  <span style={{ fontSize:12, color:T.offWhite }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color }}>{val}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.offWhite }}>Tank refill</span>
                <span style={{ fontSize:16, fontWeight:900, color:T.teal }}>+{yen(refill)}</span>
              </div>
            </div>
            <div style={{ background:T.oxygen + "18", border:"1px solid " + T.oxygen + "40", borderRadius:10, padding:"12px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:T.offWhite }}>🛸 Tank after refill</span>
              <span style={{ fontSize:16, fontWeight:900, color:T.oxygen }}>{yen(Math.min(startTank, tank + refill))}</span>
            </div>
            <Btn color={T.teal} onClick={dismissTimestamp}>Fast-forward → Event {idx+1}</Btn>
          </div>
        </Box>
      )}

      {gameOver && chosen && (
        <Box borderColor={T.red}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>💥</div>
            <div style={{ fontSize:18, fontWeight:900, color:T.red, marginBottom:6 }}>Colony Collapsed</div>
            <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6, marginBottom:14 }}>You ran out of lives. The bucket rule was broken too many times.</div>
            <Btn color={T.red} onClick={() => setScreen("result")}>See Mission Debrief →</Btn>
          </div>
        </Box>
      )}

      {!showTimestamp && !gameOver && (
        <Box borderColor={evBorderColor}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ fontSize:36 }}>{ev.icon}</div>
            <div>
              <span style={{ fontSize:9, fontWeight:700, color:ev.tagColor, border:"1px solid " + ev.tagColor + "50", borderRadius:4, padding:"2px 6px", textTransform:"uppercase", letterSpacing:0.8 }}>{ev.tag}</span>
              {ev.isBoss && <span style={{ fontSize:9, fontWeight:700, color:T.red, border:"1px solid " + T.red + "50", borderRadius:4, padding:"2px 6px", marginLeft:6, textTransform:"uppercase", letterSpacing:0.8 }}>Final Event</span>}
              <div style={{ fontSize:17, fontWeight:900, marginTop:4 }}>{ev.title}</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.75, marginBottom:14 }}>{ev.story}</div>
          {evBill && (
            <div style={{ background:T.navy, borderRadius:10, padding:"12px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:T.slate }}>{evBillLabel}</span>
              <span style={{ fontSize:20, fontWeight:900, color:T.red }}>{yenF(evBill)}</span>
            </div>
          )}
          {tankEmpty && evBill && !chosen && (
            <div style={{ background:T.red + "18", border:"1px solid " + T.red + "50", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.red, marginBottom:4 }}>⚠ Your Oxygen Tank is empty</div>
              <div style={{ fontSize:12, color:T.offWhite, lineHeight:1.5 }}>Earlier decisions drained your Emergency Fund. This is the moment the bucket rule catches up with you.</div>
            </div>
          )}
          {!chosen && (
            <div>
              <div style={{ fontSize:12, color:T.slate, marginBottom:8, fontWeight:600 }}>What do you do?</div>
              {ev.choices.map((c,i) => {
                const isLocked = c.needsTank && tankEmpty;
                return (
                  <button key={i} onClick={() => !isLocked && pick(c)} style={{ width:"100%", background:T.navyDeep, border:"2px solid " + (isLocked ? T.slate + "20" : T.navyMid), borderRadius:12, padding:"13px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10, cursor: isLocked ? "not-allowed" : "pointer", textAlign:"left", opacity: isLocked ? 0.35 : 1 }}>
                    <span style={{ fontSize:20 }}>{isLocked ? "🔒" : c.icon}</span>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:13, color:T.white, fontWeight:600 }}>{c.label}</span>
                      {isLocked && <div style={{ fontSize:11, color:T.red, marginTop:2 }}>Tank empty — locked</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {chosen && (
            <div>
              <div style={{ background: chosen.correct ? T.teal + "22" : T.red + "22", border:"2px solid " + (chosen.correct ? T.teal : T.red), borderRadius:12, padding:"14px", marginBottom:12, display:"flex", gap:10 }}>
                <span style={{ fontSize:24 }}>{chosen.correct ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color: chosen.correct ? T.teal : T.red, marginBottom:4 }}>{chosen.correct ? "Correct." : "Wrong bucket."}</div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.65 }}>{chosen.explain}</div>
                </div>
              </div>
              {!chosen.correct && evBill && (
                <div style={{ background:T.amber + "18", border:"1px solid " + T.amber + "40", borderRadius:10, padding:"12px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:10, color:T.amber, textTransform:"uppercase", letterSpacing:0.8, marginBottom:2 }}>20-year compounding cost</div>
                    <div style={{ fontSize:11, color:T.offWhite }}>{yenF(evBill)} withdrawn today at 7%/yr</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:T.amber }}>{c20(evBill)}</div>
                </div>
              )}
              {chosen.correct && evBill && (
                <div style={{ background:T.oxygen + "18", border:"1px solid " + T.oxygen + "40", borderRadius:10, padding:"12px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:T.offWhite }}>🛸 Tank remaining</span>
                  <span style={{ fontSize:16, fontWeight:900, color:T.oxygen }}>{yen(tank)}</span>
                </div>
              )}
              {ev.jessica && (
                <div style={{ background:T.teal + "12", border:"1px solid " + T.teal + "30", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                  <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginBottom:4 }}>Jessica's note:</div>
                  <div style={{ fontSize:12, color:T.offWhite, lineHeight:1.65, fontStyle:"italic" }}>"{ev.jessica}"</div>
                </div>
              )}
              {ev.isBoss && (
                <div style={{ background:T.purple + "18", border:"2px solid " + T.purple + "50", borderRadius:14, padding:"16px", marginBottom:12 }}>
                  <div style={{ fontSize:11, color:T.purple, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>⚡ Beyond the Oxygen Tank</div>
                  <div style={{ fontSize:13, color:T.white, lineHeight:1.7, marginBottom:10 }}>A ¥1,200,000 catastrophic event may exceed your Emergency Fund. The answer is <strong style={{ color:T.teal }}>still not to sell investments.</strong></div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.7, marginBottom:12 }}>The real solution is <strong style={{ color:T.purple }}>income protection insurance and disaster coverage</strong> — a layer that sits entirely above the oxygen tank.</div>
                  <div style={{ background:T.navyDeep, borderRadius:10, padding:"12px", display:"flex", gap:10 }}>
                    <span style={{ fontSize:22 }}>🔒</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:T.purple }}>Coming in Level 4</div>
                      <div style={{ fontSize:11, color:T.slate, lineHeight:1.5 }}>We'll cover exactly how to structure protection against catastrophic events — so the colony is never at risk.</div>
                    </div>
                  </div>
                </div>
              )}
              {!gameOver && <Btn color={T.teal} onClick={next}>{isLast ? "See Mission Results →" : "Next Event (" + (idx+2) + "/10) →"}</Btn>}
              {gameOver && <Btn color={T.red} onClick={() => setScreen("result")}>See Mission Debrief →</Btn>}
            </div>
          )}
        </Box>
      )}
    </Wrap>
  );
}

export default function QuizApp() {
  return (
    <Suspense fallback={
      <div style={{ background: T.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ color: T.slate, fontSize: 14 }}>Initializing Simulator...</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

function Wrap({ children }) {
  return (
    <div style={{ minHeight:"100vh", background:T.navy, fontFamily:"'Inter', system-ui, sans-serif", color:T.white, padding:"0 16px 80px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ width:"100%", maxWidth:480 }}>{children}</div>
    </div>
  );
}
function Box({ children, borderColor }) {
  return (
    <div style={{ background:T.navyCard, borderRadius:16, padding:"20px 18px", marginBottom:14, border:"1px solid " + (borderColor || T.navyMid) }}>{children}</div>
  );
}
function SliderField({ label, value, onChange, min, max, step, display, color }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:13, color:T.slate }}>{label}</span>
        <span style={{ fontSize:16, fontWeight:800, color }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width:"100%", accentColor:color, cursor:"pointer" }} />
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.slate, marginTop:2 }}>
        <span>{yen(min)}</span><span>{yen(max)}</span>
      </div>
    </div>
  );
}