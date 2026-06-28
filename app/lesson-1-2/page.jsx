"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // 👈 Added tracking hooks
import { initializeApp, getApps } from "firebase/app"; // 👈 Added Firebase modules
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
  teal:     "#1D9E75",
  amber:    "#F5A623",
  red:      "#E8404A",
  purple:   "#A78BFA",
  navy:     "#0D1B2A",
  navyCard: "#1C2D3F",
  navyDeep: "#0A1520",
  slate:    "#8DA0B3",
  offwhite: "#C8D6E2",
  white:    "#F0F4F8",
};

// ── PRIMITIVES ──
function Dots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: "5px", justifyContent: "center", padding: "12px 0 16px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i < current ? T.teal : i === current ? T.white : T.navyCard }} />
      ))}
    </div>
  );
}

function PartLabel({ text }) {
  return <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: T.slate, textTransform: "uppercase", marginBottom: "6px" }}>{text}</div>;
}

function PrimaryBtn({ children, onClick, style = {} }) {
  return <button onClick={onClick} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: "12px", padding: "15px 20px", fontSize: "15px", fontWeight: 700, width: "100%", cursor: "pointer", marginTop: "auto", ...style }}>{children}</button>;
}

function GhostBtn({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "transparent", color: T.teal, border: "1.5px solid " + T.teal, borderRadius: "12px", padding: "13px 20px", fontSize: "14px", fontWeight: 600, width: "100%", cursor: "pointer", marginTop: "8px" }}>{children}</button>;
}

function Tag({ children }) {
  return <div style={{ display: "inline-block", background: T.teal + "22", color: T.teal, border: "1px solid " + T.teal + "44", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, marginBottom: "16px" }}>{children}</div>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: T.navyCard, borderRadius: "16px", padding: "20px", marginBottom: "16px", ...style }}>{children}</div>;
}

function MythBox({ children }) {
  return (
    <div style={{ background: T.red + "15", border: "1px solid " + T.red + "40", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: T.red, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>The Myth</div>
      <div style={{ fontSize: "14px", color: T.offwhite, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// function TruthBox({ children }) {
  return (
    <div style={{ background: T.teal + "15", border: "1px solid " + T.teal + "40", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: T.teal, letterSpacing: "1px", textTransform:"uppercase", marginBottom: "6px" }}>The Reality</div>
      <div style={{ fontSize: "14px", color: T.offwhite, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function JessicaQuote({ children }) {
  return <div style={{ borderLeft: "3px solid " + T.teal, paddingLeft: "14px", margin: "16px 0", fontSize: "14px", color: T.offwhite, fontStyle: "italic", lineHeight: 1.6 }}>{children}</div>;
}

function Screen({ children }) {
  return <div style={{ background: T.navy, minHeight: "100vh", color: T.white, fontFamily: "Inter, system-ui, sans-serif", padding: "20px", maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column" }}>{children}</div>;
}

function Whiteboard() {
  const [drawn, setDrawn] = useState(false);
  const revealStyle = (delay) => ({ opacity: drawn ? 1 : 0, transition: drawn ? "opacity 0.5s ease " + delay + "s" : "none" });
  return (
    <div style={{ background: T.navyDeep, border: "1px solid " + T.teal + "30", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", color: T.slate, fontWeight: 600, letterSpacing: "0.5px" }}>WHITEBOARD</span>
        <button onClick={() => setDrawn(false) || setTimeout(() => setDrawn(true), 50)} style={{ background: T.navyCard, color: T.teal, border: "1.5px solid " + T.teal, borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>{drawn ? "↺ Replay" : "▶ Draw it"}</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: T.amber + "20", border: "2px solid " + T.amber, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "13px", color: T.offwhite }}>Apple Inc. · 1 share</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: T.amber }}>¥28,000</div>
            <div style={{ fontSize: "11px", color: T.slate, marginTop: "2px" }}>Too expensive? Keep watching.</div>
          </div>
        </div>
        <div style={{ ...revealStyle(0.4), display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "4px" }}>
          {Array.from({ length: 7 }).map((_, i) => ( <div key={i} style={{ aspectRatio: "1", borderRadius: "4px", border: "1.5px solid " + T.amber, background: T.amber + "10" }} /> ))}
          <div style={{ aspectRatio: "1", borderRadius: "4px", border: "1.5px solid " + T.teal, background: T.teal + "40" }} />
        </div>
        <div style={{ ...revealStyle(0.8), textAlign: "center", fontSize: "12px", color: T.teal, fontWeight: 600 }}>▲ Your ¥500 = 1/56th of a share. Still real ownership.</div>
        <hr style={{ border: "none", borderTop: "1px solid " + T.navyCard, margin: "2px 0" }} />
        <div style={{ ...revealStyle(1.0), display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: T.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>ETF</div>
          <div>
            <div style={{ fontSize: "13px", color: T.offwhite }}>eMAXIS Slim S&P 500</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.amber }}>¥100 / unit</div>
            <div style={{ fontSize: "11px", color: T.slate }}>500 companies. One slice. Yours.</div>
          </div>
        </div>
        <div style={{ ...revealStyle(1.2), background: T.teal + "15", border: "1px solid " + T.teal + "40", borderRadius: "12px", padding: "12px 14px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: T.white, marginBottom: "2px" }}>"The myth isn't the price.</div>
          <div style={{ fontSize: "13px", color: T.offwhite }}>It's that you think you need the whole pie."</div>
        </div>
      </div>
    </div>
  );
}

const FUNDS = [
  { name: "eMAXIS Slim S&P 500",    sub: "500 US companies · Rakuten/SBI",       price: 100 },
  { name: "eMAXIS Slim All Country", sub: "Global diversification · NISA eligible", price: 100 },
  { name: "Apple Inc. (fractional)", sub: "Single stock · via SBI Securities",    price: 28000 },
  { name: "Rakuten VT",             sub: "Total World Market · ¥100 minimum",     price: 100 },
];

function fmtYen(n) {
  if (n >= 1000000) return "¥" + (n / 1000000).toFixed(1) + "M";
  if (n >= 10000)   return "¥" + Math.round(n / 1000) + "k";
  return "¥" + Math.round(n).toLocaleString();
}

function calcDCA(mo, yr) {
  const r = 0.07 / 12;
  const n = yr * 12;
  const future   = mo * ((Math.pow(1 + r, n) - 1) / r);
  const invested = mo * n;
  return { future: Math.round(future), invested: Math.round(invested), gains: Math.round(future - invested) };
}

function TabToday({ amt }) {
  return (
    <div>
      {FUNDS.map((f) => {
        const units = amt / f.price;
        const label = units >= 1 ? units.toFixed(2) + " units" : units.toFixed(4) + " units";
        return (
          <div key={f.name} style={{ background: T.navyCard, borderRadius: "12px", padding: "13px 15px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "14px", color: T.white, fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: "12px", color: T.slate, marginTop: "2px" }}>{f.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: T.teal }}>{label}</div>
              <div style={{ fontSize: "12px", color: T.slate, marginTop: "2px" }}>@ {fmtYen(f.price)}/unit</div>
            </div>
          </div>
        );
      })}
      <JessicaQuote>Every yen buys a proportional slice. The companies don't care how much you invested — the returns are the same percentage.</JessicaQuote>
    </div>
  );
}

function TabDCA({ mo, yr }) {
  const { future, invested, gains } = calcDCA(mo, yr);
  const multiplier = (future / invested).toFixed(1);
  const milestones = [1, Math.round(yr / 3), Math.round((2 * yr) / 3), yr].filter((v, i, a) => a.indexOf(v) === i && v >= 1);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Total invested",   val: fmtYen(invested), sub: yr + " yrs · " + fmtYen(mo) + "/mo",  col: T.white },
          { label: "Projected value",  val: fmtYen(future),   sub: "at 7% avg return",                    col: T.teal  },
          { label: "Market gains",     val: "+" + fmtYen(gains), sub: "money made for free",              col: T.teal  },
          { label: "Multiplier",       val: multiplier + "x", sub: "every yen invested",                  col: T.amber },
        ].map((s) => (
          <div key={s.label} style={{ background: T.navyCard, borderRadius: "12px", padding: "13px" }}>
            <div style={{ fontSize: "11px", color: T.slate, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: s.col }}>{s.val}</div>
            <div style={{ fontSize: "11px", color: T.slate, marginTop: "2px" }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "12px", color: T.slate, marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Growth over time (7% avg/yr)</div>
        {milestones.map((y) => {
          const { future: fv } = calcDCA(mo, y);
          const { future: maxFv } = calcDCA(mo, yr);
          const pct = Math.round((fv / maxFv) * 100);
          return (
            <div key={y}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: T.slate, marginBottom: "4px" }}>
                <span>Year {y}</span>
                <span style={{ fontWeight: 700, color: T.white }}>{fmtYen(fv)}</span>
              </div>
              <div style={{ background: T.navyDeep, borderRadius: "8px", height: "10px", marginBottom: "10px", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "8px", width: pct + "%", background: T.teal, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
      <JessicaQuote>7% is the historical average real return of the S&P 500. Not a guarantee — but 100 years of data says it's a reasonable expectation.</JessicaQuote>
    </div>
  );
}

function SliderRow({ label, val, display, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", color: T.offwhite }}>{label}</span>
        <span style={{ fontSize: "15px", fontWeight: 700, color: T.teal }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: T.teal }} />
    </div>
  );
}

function Calculator({ onNext }) {
  const [tab, setTab]   = useState(1);
  const [amt, setAmt]   = useState(500);
  const [mo,  setMo]    = useState(5000);
  const [yr,  setYr]    = useState(10);
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[{ id: 1, label: "What ¥X buys today" }, { id: 2, label: "Keep buying monthly" }].map((t) => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer", textAlign: "center", fontSize: "13px", fontWeight: 600, background: T.navyCard, color: tab === t.id ? T.teal : T.slate, border: "1.5px solid " + (tab === t.id ? T.teal : "transparent") }}>{t.label}</div>
        ))}
      </div>
      {tab === 1 && (
        <>
          <SliderRow label="Amount to invest" val={amt} display={fmtYen(amt)} min={500} max={50000} step={500} onChange={setAmt} />
          <TabToday amt={amt} />
        </>
      )}
      {tab === 2 && (
        <>
          <SliderRow label="Monthly investment" val={mo} display={fmtYen(mo)} min={500} max={50000} step={500} onChange={setMo} />
          <SliderRow label="Years" val={yr} display={yr + " years"} min={1} max={30} step={1} onChange={setYr} />
          <TabDCA mo={mo} yr={yr} />
        </>
      )}
      <PrimaryBtn onClick={() => onNext(mo)}>See my verdict</PrimaryBtn>
    </div>
  );
}

function Lesson11Content() {
  const searchParams = useSearchParams();
  const urlUid = searchParams.get("uid");
  const uid = urlUid || (typeof window !== "undefined" ? sessionStorage.getItem("knowvest_uid") : null);

  useEffect(() => {
    if (urlUid && typeof window !== "undefined") {
      sessionStorage.setItem("knowvest_uid", urlUid);
    }
  }, [urlUid]);

  const [step, setStep] = useState(0);
  const [mo, setMo]     = useState(5000);

  // ── CENTRAL ROUTER INTEGRATION ──
  async function triggerQuizNavigation(chosenMo) {
    if (uid) {
      try {
        const ref = doc(db, "users", uid, "progress", "summary");
        await setDoc(ref, { lesson_1_1: { status: "inprogress" } }, { merge: true });
      } catch (e) {
        console.error(e);
      }
    }
    window.location.href = `https://project-0d07n.vercel.app/lesson-1-1-quiz.html?uid=${uid}`;
  }

  return (
    <div style={{ background: T.navy, minHeight: "100vh" }}>
      {step === 0 && (
        <Screen>
          <Dots total={5} current={0} />
          <PartLabel text="Lesson 1-1 · The Capital Myth" />
          <div style={{ fontSize: "28px", fontWeight: 700, color: T.white, lineHeight: 1.2, margin: "16px 0 20px" }}>"I'll start investing when I have more money."</div>
          <div style={{ fontSize: "15px", color: T.offwhite, lineHeight: 1.65, marginBottom: "20px" }}>Sound familiar? You've told yourself this. Maybe more than once.<br /><br />Here's the brutal truth — <span style={{ color: T.teal, fontWeight: 700 }}>that sentence has cost people more wealth than any market crash in history.</span></div>
          <MythBox>You need thousands — maybe tens of thousands — to start investing.</MythBox>
          <TruthBox>You can own a piece of the world's biggest companies <span style={{ color: T.teal, fontWeight: 700 }}>today</span>, with ¥500 in your pocket.</TruthBox>
          <JessicaQuote>"On the trading desk, we didn't ask clients how much they had. We asked them what they were waiting for. The answer was always the same: 'enough'. Enough never comes unless you start."</JessicaQuote>
          <PrimaryBtn onClick={() => setStep(1)}>I'm listening — show me how</PrimaryBtn>
        </Screen>
      )}
      {step === 1 && (
        <Screen>
          <Dots total={5} current={1} />
          <PartLabel text="Part 1 · The Analogy" />
          <div style={{ fontSize: "22px", fontWeight: 700, color: T.white, marginBottom: "10px" }}>The Pizza Problem</div>
          <div style={{ fontSize: "15px", color: T.offwhite, lineHeight: 1.65, marginBottom: "16px" }}>Imagine the most expensive pizza in Tokyo. ¥28,000 a slice. You can't afford the whole pie — so you walk away hungry, right?<br /><br /><span style={{ color: T.teal, fontWeight: 700 }}>Wrong.</span> What if you could split it with 56 people, each paying ¥500, and every topping added still belongs to you proportionally?</div>
          <Whiteboard />
          <PrimaryBtn onClick={() => setStep(2)}>Got it — what's the rule?</PrimaryBtn>
        </Screen>
      )}
      {step === 2 && (
        <Screen>
          <Dots total={5} current={2} />
          <PartLabel text="Part 2 · The Rule" />
          <div style={{ fontSize: "22px", fontWeight: 700, color: T.white, marginBottom: "10px" }}>Fractional Ownership. No Minimum. No Myth.</div>
          <div style={{ fontSize: "15px", color: T.offwhite, lineHeight: 1.65, marginBottom: "14px" }}>Here's how it actually works — no fluff.</div>
          <MythBox>1 share of Apple = ¥28,000. Take it or leave it.</MythBox>
          <div style={{ background: T.teal + "15", border: "1px solid " + T.teal + "40", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: T.teal, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>New world — fractional shares</div>
            <div style={{ fontSize: "14px", color: T.offwhite, lineHeight: 1.5 }}>You buy <span style={{ color: T.teal, fontWeight: 700 }}>¥500 worth</span>. You own <span style={{ color: T.teal, fontWeight: 700 }}>0.0178 of a share</span>. When Apple goes up 10%, your slice goes up 10% too. Proportional. Always.</div>
          </div>
          <Card>
            <div style={{ fontSize: "12px", color: T.slate, marginBottom: "6px" }}>The even better news — ETFs</div>
            <div style={{ fontSize: "14px", color: T.offwhite, lineHeight: 1.6 }}>An ETF like <span style={{ color: T.teal, fontWeight: 700 }}>eMAXIS Slim S&P 500</span> starts at <span style={{ color: T.teal, fontWeight: 700 }}>¥100</span> per unit — and you're instantly diversified across 500 American companies.<br /><br />This isn't a side door. This is <span style={{ color: T.teal, fontWeight: 700 }}>the same door</span> institutional investors use.</div>
          </Card>
          <JessicaQuote>"The minimum isn't about money. It's about deciding. ¥500 invested beats ¥500,000 talked about."</JessicaQuote>
          <PrimaryBtn onClick={() => setStep(3)}>Show me with my own numbers</PrimaryBtn>
        </Screen>
      )}
      {step === 3 && (
        <Screen>
          <Dots total={5} current={3} />
          <PartLabel text="Part 3 · The Calculator" />
          <div style={{ fontSize: "22px", fontWeight: 700, color: T.white, marginBottom: "16px" }}>Your ¥500. Calculated.</div>
          <Calculator onNext={(chosenMo) => { setMo(chosenMo); setStep(4); }} />
        </Screen>
      )}
      {step === 4 && (
        <Screen>
          <Dots total={5} current={4} />
          <PartLabel text="Part 4 · The Verdict" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            <div style={{ fontSize: "48px", textAlign: "center", margin: "16px 0 10px" }}>{(mo >= 1000) ? "🟢" : "🟡"}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, textAlign: "center", marginBottom: "10px", color: (mo >= 1000) ? T.teal : T.amber }}>{(mo >= 1000) ? "You're ready for the next level." : "Almost. Let's fix one thing first."}</div>
            <div style={{ fontSize: "15px", color: T.offwhite, textAlign: "center", lineHeight: 1.6, marginBottom: "20px" }}>
              {(mo >= 1000)
                ? `With ${fmtYen(mo)}/month, you're not just dabbling — you're building. Over 10 years at 7%, that habit turns into ${fmtYen(calcDCA(mo, 10).future)}. The market doesn't care about your feelings. It cares about your consistency.`
                : `You can technically start with ${fmtYen(mo)} — but at that level, fees can eat your returns. The goal is to get to ¥1,000/month minimum before automating. That's your quest.`}
            </div>
            {(mo >= 1000) ? (
              <Card>
                <div style={{ fontSize: "12px", color: T.slate, marginBottom: "4px" }}>Your projected portfolio (10 yr)</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: T.teal }}>{fmtYen(calcDCA(mo, 10).future)}</div>
                <div style={{ fontSize: "13px", color: T.slate, marginTop: "4px" }}>vs {fmtYen(calcDCA(mo, 10).invested)} invested · {(calcDCA(mo, 10).future / calcDCA(mo, 10).invested).toFixed(1)}x multiplier</div>
              </Card>
            ) : (
              <div style={{ background: T.navyCard, borderRadius: "12px", padding: "16px", borderLeft: "3px solid " + T.amber, marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: T.slate, marginBottom: "6px" }}>Your quest</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: T.white, marginBottom: "6px" }}>Increase monthly investment to ¥1,000</div>
                <div style={{ fontSize: "13px", color: T.slate }}>Check your expense audit from Lesson 1-2 — find ¥500 more.</div>
              </div>
            )}
            <PrimaryBtn onClick={triggerQuizNavigation}>
              {(mo >= 1000) ? "Enter Simulator Quiz →" : "I'll hit ¥1,000 — Enter Simulator Quiz →"}
            </PrimaryBtn>
            {mo < 1000 && <GhostBtn onClick={() => setStep(3)}>← Adjust my numbers</GhostBtn>}
          </div>
        </Screen>
      )}
    </div>
  );
}

export default function Lesson11() {
  return (
    <Suspense fallback={<div style={{ background: T.navy, minHeight: "100vh" }} />}>
      <Lesson11Content />
    </Suspense>
  );
}