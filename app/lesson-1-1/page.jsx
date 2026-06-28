"use client";
import { useState, useEffect, useRef } from "react";

const T = {
  navy:"#0D1B2A", navyMid:"#152130", navyCard:"#1C2D3F", navyDeep:"#0A1520",
  teal:"#1D9E75", tealDim:"#0f5c43", amber:"#F5A623", red:"#E8404A",
  purple:"#A78BFA", blue:"#60A5FA", slate:"#8DA0B3", white:"#F0F4F8", offWhite:"#C8D6E2",
  oxygen:"#38BDF8", colony:"#1D9E75",
};

const fmt = (n) => {
  if (n >= 1000000) return `¥${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `¥${(n/1000).toFixed(0)}k`;
  return `¥${Math.round(n).toLocaleString()}`;
};
const fmtFull = (n) => `¥${Math.round(n).toLocaleString()}`;

// ── Space Station Whiteboard ──────────────────────────────────
function WB_SpaceStation({ play }) {
  // Left side: colony bricks stacking up (growth engine)
  // Right side: oxygen tank filling (liquidity)
  // Center: hard line separator
  // Bottom: "forced sell" consequence

  const bricks = [
    { x:20,  y:118, w:52, h:16, delay:0.3 },
    { x:20,  y:100, w:52, h:16, delay:0.5 },
    { x:20,  y:82,  w:52, h:16, delay:0.7 },
    { x:20,  y:64,  w:52, h:16, delay:0.9 },
    { x:20,  y:46,  w:52, h:16, delay:1.1 },
  ];

  return (
    <div style={{ padding:"8px 0" }}>
      {/* Title row */}
      <div style={{ display:"flex", justifyContent:"space-around", marginBottom:10 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.colony, textTransform:"uppercase", letterSpacing:0.8 }}>
            🚀 Mars Colony
          </div>
          <div style={{ fontSize:10, color:T.slate }}>Growth Engine</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.oxygen, textTransform:"uppercase", letterSpacing:0.8 }}>
            🛸 Oxygen Tank
          </div>
          <div style={{ fontSize:10, color:T.slate }}>Emergency Cash</div>
        </div>
      </div>

      {/* Main illustration area */}
      <svg viewBox="0 0 300 155" style={{ width:"100%", overflow:"visible" }}>

        {/* ── LEFT: Colony bricks ── */}
        {/* Ground base */}
        <rect x="14" y="134" width="66" height="8" rx="2"
          fill={`${T.colony}40`} stroke={T.colony} strokeWidth="1.5" />
        {/* Bricks animate in */}
        {bricks.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
            fill={`${T.colony}${i < 3 ? "60" : "35"}`}
            stroke={T.colony} strokeWidth="1"
            style={{
              opacity: 0,
              animation: play ? `fadeUp 0.4s ease ${b.delay}s forwards` : "none",
            }} />
        ))}
        {/* Brick mortar lines */}
        {bricks.map((b, i) => (
          <line key={`m${i}`} x1={b.x+2} y1={b.y+b.h/2} x2={b.x+b.w-2} y2={b.y+b.h/2}
            stroke={`${T.colony}40`} strokeWidth="0.5"
            style={{ opacity: 0, animation: play ? `fadeUp 0.4s ease ${b.delay+0.1}s forwards` : "none" }} />
        ))}
        {/* Colony label */}
        <text x="47" y="42" textAnchor="middle" fill={T.colony} fontSize="9" fontWeight="700"
          style={{ opacity:0, animation: play?"fadeUp 0.4s ease 1.3s forwards":"none" }}>
          LONG-TERM
        </text>
        <text x="47" y="52" textAnchor="middle" fill={T.colony} fontSize="9"
          style={{ opacity:0, animation: play?"fadeUp 0.4s ease 1.4s forwards":"none" }}>
          STRUCTURE
        </text>

        {/* ── CENTER: Hard dividing line ── */}
        <line x1="150" y1="20" x2="150" y2="145"
          stroke={`${T.amber}80`} strokeWidth="1.5" strokeDasharray="4,3"
          style={{ opacity:0, animation: play?"fadeIn 0.5s ease 0.4s forwards":"none" }} />
        <text x="150" y="16" textAnchor="middle" fill={T.amber} fontSize="8" fontWeight="700"
          style={{ opacity:0, animation: play?"fadeIn 0.4s ease 0.8s forwards":"none" }}>
          THE LINE
        </text>

        {/* ── RIGHT: Oxygen tank ── */}
        {/* Tank body outline */}
        <rect x="218" y="38" width="52" height="90" rx="8"
          fill="none" stroke={T.oxygen} strokeWidth="2"
          style={{ opacity:0, animation: play?"fadeIn 0.5s ease 0.3s forwards":"none" }} />
        {/* Tank cap */}
        <rect x="232" y="32" width="24" height="8" rx="3"
          fill="none" stroke={T.oxygen} strokeWidth="1.5"
          style={{ opacity:0, animation: play?"fadeIn 0.5s ease 0.3s forwards":"none" }} />
        {/* Tank fill — animates up */}
        <clipPath id="tankClip">
          <rect x="220" y="40" width="48" height="86" rx="6" />
        </clipPath>
        <rect x="220" y="40" width="48" height="86" rx="6"
          fill={`${T.oxygen}25`}
          style={{ opacity:0, animation: play?"fadeIn 0.3s ease 0.4s forwards":"none" }} />
        <rect x="220" y="80" width="48" height="46" rx="0"
          clipPath="url(#tankClip)"
          fill={`${T.oxygen}60`}
          style={{
            opacity:0,
            animation: play?"tankFill 1.2s ease 0.9s forwards":"none",
          }} />
        {/* Gauge lines */}
        {[0.25, 0.5, 0.75].map((pct, i) => (
          <line key={i}
            x1="220" y1={40 + (1-pct)*86}
            x2="230" y2={40 + (1-pct)*86}
            stroke={`${T.oxygen}60`} strokeWidth="1"
            style={{ opacity:0, animation: play?`fadeIn 0.3s ease ${1.2+i*0.1}s forwards`:"none" }} />
        ))}
        {/* O2 label */}
        <text x="244" y="68" textAnchor="middle" fill={T.oxygen} fontSize="14" fontWeight="900"
          style={{ opacity:0, animation: play?"fadeIn 0.5s ease 1.5s forwards":"none" }}>
          O₂
        </text>
        <text x="244" y="80" textAnchor="middle" fill={T.oxygen} fontSize="8"
          style={{ opacity:0, animation: play?"fadeIn 0.4s ease 1.6s forwards":"none" }}>
          3–6 mo
        </text>
        <text x="244" y="90" textAnchor="middle" fill={T.oxygen} fontSize="8"
          style={{ opacity:0, animation: play?"fadeIn 0.4s ease 1.7s forwards":"none" }}>
          expenses
        </text>

        {/* ── BOTTOM: Forced sell consequence ── */}
        <g style={{ opacity:0, animation: play?"fadeIn 0.6s ease 2.0s forwards":"none" }}>
          {/* Arrow from brick down */}
          <path d="M47,44 L47,148" stroke={T.red} strokeWidth="1.5" strokeDasharray="3,2" fill="none" />
          <polygon points="44,148 47,154 50,148" fill={T.red} />
          <rect x="4" y="154" width="292" height="18" rx="4" fill={`${T.red}20`} stroke={`${T.red}50`} strokeWidth="1" />
          <text x="150" y="166" textAnchor="middle" fill={T.red} fontSize="9" fontWeight="700">
            ⚠ Forced sell = Paper loss becomes PERMANENT loss
          </text>
        </g>

        <style>{`
          @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          @keyframes tankFill { from { transform:scaleY(0); transform-origin:bottom; opacity:0; } to { transform:scaleY(1); transform-origin:bottom; opacity:1; } }
        `}</style>
      </svg>
    </div>
  );
}

// ── Consequence Whiteboard ────────────────────────────────────
function WB_ForcedSell({ play, monthsCovered }) {
  const hasCushion = monthsCovered >= 3;
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:T.slate, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
        Same market dip — two different outcomes
      </div>
      <div style={{ display:"flex", gap:10 }}>
        {/* Scenario A — No cushion */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.red, marginBottom:6, textAlign:"center" }}>
            ❌ No Oxygen Tank
          </div>
          {[
            { text:"Market dips 15%", color:T.slate, delay:0.3 },
            { text:"Emergency hits", color:T.amber, delay:0.6 },
            { text:"Forced to sell", color:T.red, delay:0.9 },
            { text:"Loss = permanent", color:T.red, delay:1.2 },
          ].map((s, i) => (
            <div key={i} style={{
              padding:"6px 8px", borderRadius:6, marginBottom:4,
              background:`${s.color}18`, border:`1px solid ${s.color}40`,
              fontSize:11, color:s.color, fontWeight:600, textAlign:"center",
              opacity:play?1:0,
              transition:play?`opacity 0.4s ease ${s.delay}s`:"none",
            }}>
              {s.text}
            </div>
          ))}
        </div>

        {/* VS */}
        <div style={{ display:"flex", alignItems:"center", fontSize:11, color:T.slate, fontWeight:700 }}>VS</div>

        {/* Scenario B — With cushion */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.teal, marginBottom:6, textAlign:"center" }}>
            ✅ Full Oxygen Tank
          </div>
          {[
            { text:"Market dips 15%", color:T.slate, delay:0.4 },
            { text:"Emergency hits", color:T.amber, delay:0.7 },
            { text:"Use HYSA cash", color:T.teal, delay:1.0 },
            { text:"Investments untouched", color:T.teal, delay:1.3 },
          ].map((s, i) => (
            <div key={i} style={{
              padding:"6px 8px", borderRadius:6, marginBottom:4,
              background:`${s.color}18`, border:`1px solid ${s.color}40`,
              fontSize:11, color:s.color, fontWeight:600, textAlign:"center",
              opacity:play?1:0,
              transition:play?`opacity 0.4s ease ${s.delay}s`:"none",
            }}>
              {s.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop:12, padding:"10px 12px", background:T.navyDeep, borderRadius:8,
        fontSize:12, color:T.offWhite, lineHeight:1.5,
        opacity:play?1:0, transition:play?"opacity 0.5s ease 1.8s":"none",
      }}>
        The market dip was identical. The outcome was decided{" "}
        <span style={{ color:T.amber, fontWeight:700 }}>before the dip even happened.</span>
      </div>
    </div>
  );
}

// ── WB Panel ──────────────────────────────────────────────────
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
        <button onClick={toggle} style={{
          background:`${color}20`, border:`1px solid ${color}50`,
          borderRadius:20, padding:"4px 14px",
          color, fontSize:11, fontWeight:700, cursor:"pointer",
        }}>
          {!played ? "▶ Draw it" : "↺ Replay"}
        </button>
      </div>
      {typeof children === "function" ? children(play) : children}
    </div>
  );
}

// ── Main Lesson 1-1 ───────────────────────────────────────────
export default function Lesson12() {
  // parts: 0=hook, 1=analogy, 2=rule, 3=calculator, 4=verdict
  const [part, setPart]           = useState(0);
  const [expenses, setExpenses]   = useState(200000);
  const [currentCash, setCurrentCash] = useState(600000);
  const [monthsTarget, setMonthsTarget] = useState(3);
  const topRef = useRef(null);

  const oxygenTarget   = expenses * monthsTarget;
  const deployable     = Math.max(0, currentCash - oxygenTarget);
  const cushionMonths  = currentCash / Math.max(expenses, 1);
  const oxygenFull     = cushionMonths >= monthsTarget;
  const oxygenPct      = Math.min(100, (currentCash / Math.max(oxygenTarget, 1)) * 100);
  const shortfall      = Math.max(0, oxygenTarget - currentCash);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior:"smooth" }); }, [part]);

  const LABELS = ["The Fear","The Analogy","The Rule","Your Numbers","Your Verdict"];

  return (
    <div ref={topRef} style={{
      minHeight:"100vh", background:T.navy,
      fontFamily:"'Inter', system-ui, sans-serif",
      color:T.white, padding:"0 16px 80px",
      display:"flex", flexDirection:"column", alignItems:"center",
    }}>
      <div style={{ width:"100%", maxWidth:480 }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 14px" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:2, color:T.slate, textTransform:"uppercase", marginBottom:3 }}>
              Level 1 · Lesson 1-1
            </div>
            <div style={{ fontSize:17, fontWeight:800 }}>{LABELS[part]}</div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            {LABELS.map((_,i) => (
              <div key={i} style={{
                height:4, width:i===part?22:8, borderRadius:2,
                background:i<part?T.teal:i===part?T.oxygen:T.navyCard,
                transition:"all 0.4s",
              }} />
            ))}
          </div>
        </div>

        {/* Lesson badge */}
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:T.navyCard, borderRadius:12, padding:"10px 14px",
          marginBottom:14, border:`1px solid ${T.navyMid}`,
        }}>
          <span style={{ fontSize:22 }}>🛸</span>
          <div>
            <div style={{ fontSize:11, color:T.oxygen, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
              The Liquidity Line
            </div>
            <div style={{ fontSize:12, color:T.slate }}>Separating your Oxygen Tank from your Growth Engine</div>
          </div>
        </div>

        {/* ═══ PART 0: THE FEAR ═══ */}
        {part === 0 && (
          <Fade>
            <Card borderColor={T.red}>
              <Pill color={T.red}>The Block We're Solving</Pill>
              <div style={{ fontSize:21, fontWeight:900, lineHeight:1.3, marginBottom:10 }}>
                "What if I invest today and need the money next month?"
              </div>

              <div style={{ background:T.navy, borderRadius:12, padding:"14px 16px", marginBottom:16, borderLeft:`3px solid ${T.red}` }}>
                <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.75 }}>
                  You've cleared Level 0. Your debt is clean, your baseline cash is real.
                  <br /><br />
                  But right now, there's one fear keeping your finger off the buy button:
                  <br /><br />
                  <span style={{ fontSize:16, fontWeight:800, color:T.red }}>
                    "What if I get trapped?"
                  </span>
                  <br /><br />
                  Car breaks down. Dentist bill. Job shock. If your money is locked in the market during a dip —
                  are you going to be forced to sell at a loss just to survive?
                </div>
              </div>

              <div style={{ background:`${T.teal}15`, border:`1px solid ${T.teal}40`, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.teal, marginBottom:6 }}>
                  Jessica's answer:
                </div>
                <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.7 }}>
                  You don't guess. You draw a hard, mathematical line between two completely separate buckets of money — and you never, ever mix them up.
                </div>
              </div>

              <Btn color={T.oxygen} onClick={() => setPart(1)}>Show me the line →</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 1: THE ANALOGY ═══ */}
        {part === 1 && (
          <Fade>
            <Card borderColor={T.oxygen}>
              <Pill color={T.oxygen}>The Analogy</Pill>
              <div style={{ fontSize:21, fontWeight:900, lineHeight:1.3, marginBottom:6 }}>
                The Mars Colony & The Oxygen Tank
              </div>
              <div style={{ fontSize:13, color:T.oxygen, fontWeight:600, marginBottom:16 }}>
                Your investments are the colony. Your emergency cash is the spacesuit.
              </div>

              <WBPanel title="Jessica's Whiteboard" color={T.oxygen}>
                {(play) => <WB_SpaceStation play={play} />}
              </WBPanel>

              {/* Analogy breakdown */}
              {[
                {
                  icon:"🧱",
                  title:"The Mars Colony = Your Growth Engine",
                  body:"Your index funds and portfolio are the structural bricks of your long-term wealth. They are built to stay in place for decades. Every time you pull a brick out of the wall to pay for an emergency, you damage the structure — and worse, you might be pulling it out right when the market is at its lowest.",
                  color: T.colony,
                },
                {
                  icon:"🛸",
                  title:"The Oxygen Tank = Your Emergency Cash",
                  body:"Your liquid HYSA cash is the oxygen attached directly to your spacesuit. Its only job is to keep you alive during a short-term emergency. It doesn't make you rich. It keeps you safe — so your colony never has to be torn down.",
                  color: T.oxygen,
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background:T.navy, borderRadius:12, padding:"14px 16px",
                  marginBottom:12, borderLeft:`3px solid ${item.color}`,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>{item.icon}</span>
                    <div style={{ fontSize:13, fontWeight:700, color:item.color }}>{item.title}</div>
                  </div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.7 }}>{item.body}</div>
                </div>
              ))}

              {/* The key insight */}
              <div style={{
                background:`${T.amber}12`, border:`1px solid ${T.amber}40`,
                borderRadius:12, padding:"14px 16px", marginBottom:16,
              }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.amber, marginBottom:6 }}>
                  The critical insight:
                </div>
                <div style={{ fontSize:13, color:T.white, lineHeight:1.7 }}>
                  A temporary 15% market dip is completely normal. If you're forced to sell during that dip because you have no oxygen tank — you just turned a{" "}
                  <span style={{ color:T.amber, fontWeight:700 }}>temporary paper loss</span>
                  {" "}into a{" "}
                  <span style={{ color:T.red, fontWeight:700 }}>permanent capital loss.</span>
                  {" "}Wall Street wins. You lose.
                </div>
              </div>

              <WBPanel title="Same Dip — Two Outcomes" color={T.red}>
                {(play) => <WB_ForcedSell play={play} monthsCovered={cushionMonths} />}
              </WBPanel>

              <Btn color={T.oxygen} onClick={() => setPart(2)}>Show me the rule →</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 2: THE RULE ═══ */}
        {part === 2 && (
          <Fade>
            <Card>
              <Pill color={T.teal}>The Rule</Pill>
              <div style={{ fontSize:21, fontWeight:900, lineHeight:1.3, marginBottom:6 }}>
                Two buckets. Two jobs. Never mixed.
              </div>
              <div style={{ fontSize:13, color:T.slate, marginBottom:18 }}>
                We split your capital with a hard mathematical line. Each bucket has exactly one job.
              </div>

              {/* Bucket A */}
              <div style={{
                background:T.navyDeep, border:`2px solid ${T.oxygen}`,
                borderRadius:14, padding:"16px 18px", marginBottom:12,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:28 }}>🛸</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:T.oxygen }}>Bucket A — The Oxygen Tank</div>
                    <div style={{ fontSize:11, color:T.slate }}>High-Yield Savings Account (HYSA)</div>
                  </div>
                </div>
                {[
                  { icon:"✓", text:"100% liquid — withdraw in 24 hours, no penalty", color:T.teal },
                  { icon:"✓", text:"3–6 months of living expenses, no more", color:T.teal },
                  { icon:"✓", text:"Earns interest to fight inflation — but never invested", color:T.teal },
                  { icon:"✗", text:"Never used for weekend trips, new gadgets, or market dips", color:T.red },
                ].map((r, i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                    <span style={{ fontSize:12, color:r.color, fontWeight:700, marginTop:1, flexShrink:0 }}>{r.icon}</span>
                    <span style={{ fontSize:12, color:T.offWhite, lineHeight:1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* Bucket B */}
              <div style={{
                background:T.navyDeep, border:`2px solid ${T.colony}`,
                borderRadius:14, padding:"16px 18px", marginBottom:16,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:28 }}>🚀</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:T.colony }}>Bucket B — The Growth Engine</div>
                    <div style={{ fontSize:11, color:T.slate }}>Brokerage Account / NISA</div>
                  </div>
                </div>
                {[
                  { icon:"✓", text:"Minimum 5-year horizon — this money does not leave", color:T.teal },
                  { icon:"✓", text:"Every spare yen after the oxygen tank is full goes here", color:T.teal },
                  { icon:"✓", text:"Designed to ride out dips — that's the whole point", color:T.teal },
                  { icon:"✗", text:"Never touched for emergencies — that's what Bucket A is for", color:T.red },
                ].map((r, i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                    <span style={{ fontSize:12, color:r.color, fontWeight:700, marginTop:1, flexShrink:0 }}>{r.icon}</span>
                    <span style={{ fontSize:12, color:T.offWhite, lineHeight:1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* The order of operations */}
              <div style={{
                background:`${T.amber}12`, border:`1px solid ${T.amber}40`,
                borderRadius:12, padding:"14px 16px", marginBottom:16,
              }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.amber, marginBottom:8 }}>
                  The order of operations:
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {[
                    { label:"Fill Bucket A", sub:"3–6 mo expenses", icon:"🛸", color:T.oxygen },
                    { label:"→", sub:"", icon:"", color:T.slate },
                    { label:"Deploy to Bucket B", sub:"every extra yen", icon:"🚀", color:T.colony },
                  ].map((s, i) => (
                    s.label === "→"
                      ? <div key={i} style={{ fontSize:20, color:T.slate }}>→</div>
                      : <div key={i} style={{ flex:1, textAlign:"center", background:T.navyDeep, borderRadius:10, padding:"10px 8px" }}>
                          <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.label}</div>
                          <div style={{ fontSize:10, color:T.slate, marginTop:2 }}>{s.sub}</div>
                        </div>
                  ))}
                </div>
              </div>

              <Btn color={T.teal} onClick={() => setPart(3)}>Calculate my Liquidity Line →</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 3: CALCULATOR ═══ */}
        {part === 3 && (
          <Fade>
            <Card>
              <Pill color={T.teal}>The Liquidity Calculator</Pill>
              <div style={{ fontSize:21, fontWeight:900, lineHeight:1.3, marginBottom:6 }}>
                Your personal Oxygen Tank size
              </div>
              <div style={{ fontSize:13, color:T.slate, marginBottom:18 }}>
                Plug in your real numbers. We'll tell you exactly where the line is drawn.
              </div>

              <Slider label="Monthly living expenses" value={expenses} onChange={setExpenses}
                min={50000} max={800000} step={10000} display={fmt(expenses)} color={T.slate} />

              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, color:T.slate }}>Oxygen tank target</span>
                  <div style={{ display:"flex", gap:8 }}>
                    {[3,4,6].map(m => (
                      <button key={m} onClick={() => setMonthsTarget(m)} style={{
                        padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer",
                        border:`1.5px solid ${monthsTarget===m?T.oxygen:T.navyMid}`,
                        background:monthsTarget===m?`${T.oxygen}25`:T.navyCard,
                        color:monthsTarget===m?T.oxygen:T.slate,
                        transition:"all 0.2s",
                      }}>{m} mo</button>
                    ))}
                  </div>
                </div>
                <div style={{ background:T.navyDeep, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, color:T.offWhite }}>Your Oxygen Tank target:</span>
                    <span style={{ fontSize:18, fontWeight:900, color:T.oxygen }}>{fmtFull(oxygenTarget)}</span>
                  </div>
                </div>
              </div>

              <Slider label="Current liquid cash (savings)" value={currentCash} onChange={setCurrentCash}
                min={0} max={3000000} step={10000} display={fmt(currentCash)} color={oxygenFull?T.teal:T.amber} />

              {/* Live oxygen tank fill visual */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, color:T.slate }}>Oxygen Tank status</span>
                  <span style={{ fontSize:13, fontWeight:800, color:oxygenFull?T.teal:T.amber }}>
                    {Math.min(100, Math.round(oxygenPct))}% full
                  </span>
                </div>
                <div style={{ background:T.navyDeep, borderRadius:6, height:24, overflow:"hidden", position:"relative" }}>
                  <div style={{
                    height:"100%",
                    width:`${Math.min(100, oxygenPct)}%`,
                    background: oxygenFull
                      ? `linear-gradient(90deg, ${T.teal}, ${T.oxygen})`
                      : `linear-gradient(90deg, ${T.amber}, ${T.oxygen}60)`,
                    borderRadius:6,
                    transition:"width 0.4s ease",
                    display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:8,
                  }}>
                    {oxygenPct > 20 && (
                      <span style={{ fontSize:10, fontWeight:700, color:T.navy }}>🛸</span>
                    )}
                  </div>
                  {/* Target line at 100% */}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.slate, marginTop:3 }}>
                  <span>¥0</span>
                  <span style={{ color:oxygenFull?T.teal:T.amber }}>Target: {fmtFull(oxygenTarget)}</span>
                </div>
              </div>

              {/* Live split summary */}
              <div style={{
                background:T.navyDeep, borderRadius:12, padding:"14px 16px", marginBottom:16,
              }}>
                <div style={{ fontSize:11, color:T.slate, textTransform:"uppercase", letterSpacing:0.8, marginBottom:12 }}>
                  Your Capital Split
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1, background:`${T.oxygen}15`, border:`1px solid ${T.oxygen}40`, borderRadius:10, padding:"10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:T.oxygen, marginBottom:4 }}>🛸 Oxygen Tank</div>
                    <div style={{ fontSize:16, fontWeight:900, color:T.oxygen }}>{fmtFull(Math.min(currentCash, oxygenTarget))}</div>
                    <div style={{ fontSize:10, color:T.slate, marginTop:2 }}>stays in HYSA</div>
                  </div>
                  <div style={{ flex:1, background:`${deployable > 0 ? T.teal : T.slate}15`, border:`1px solid ${deployable > 0 ? T.teal : T.slate}40`, borderRadius:10, padding:"10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color: deployable > 0 ? T.teal : T.slate, marginBottom:4 }}>🚀 Deployable</div>
                    <div style={{ fontSize:16, fontWeight:900, color: deployable > 0 ? T.teal : T.slate }}>{fmtFull(deployable)}</div>
                    <div style={{ fontSize:10, color:T.slate, marginTop:2 }}>ready to invest</div>
                  </div>
                </div>

                {!oxygenFull && (
                  <div style={{ marginTop:10, fontSize:12, color:T.amber, textAlign:"center", lineHeight:1.5 }}>
                    ⚠ Fill the oxygen tank first. You need{" "}
                    <strong>{fmtFull(shortfall)} more</strong> before deploying to the market.
                  </div>
                )}
              </div>

              <Btn color={T.teal} onClick={() => setPart(4)}>See my verdict →</Btn>
            </Card>
          </Fade>
        )}

        {/* ═══ PART 4: VERDICT ═══ */}
        {part === 4 && (
          <Fade>

            {/* GREEN LIGHT */}
            {oxygenFull && (
              <Card borderColor={T.teal}>
                <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                  <div style={{ fontSize:52, marginBottom:10 }}>🟢</div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.teal, marginBottom:6 }}>
                    Oxygen Tank is full.
                  </div>
                  <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>
                    You are mathematically protected. The Lock-up Fear Boss is defeated.
                  </div>
                </div>
                <Hr />

                {/* The deployable number — hero stat */}
                <div style={{
                  background:`${T.teal}15`, border:`2px solid ${T.teal}`,
                  borderRadius:14, padding:"20px", textAlign:"center", marginBottom:16,
                }}>
                  <div style={{ fontSize:12, color:T.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                    You can invest today — guilt-free
                  </div>
                  <div style={{ fontSize:40, fontWeight:900, color:T.teal, marginBottom:4 }}>
                    {fmtFull(deployable)}
                  </div>
                  <div style={{ fontSize:12, color:T.offWhite }}>
                    Your Oxygen Tank ({fmtFull(oxygenTarget)}) is secured in HYSA.
                    This amount is free to deploy to the market.
                  </div>
                </div>

                {/* Summary rows */}
                <VRow icon="🛸" color={T.oxygen} label="Oxygen Tank (HYSA)" value={fmtFull(Math.min(currentCash, oxygenTarget))} />
                <VRow icon="🚀" color={T.teal}   label="Deployable to market"  value={fmtFull(deployable)} />
                <VRow icon="📅" color={T.slate}  label="Monthly expenses"      value={fmtFull(expenses)} />
                <VRow icon="⏱" color={T.slate}  label="Coverage"              value={`${cushionMonths.toFixed(1)} months`} />

                {/* Quest card */}
                <div style={{
                  background:`${T.teal}12`, border:`1px solid ${T.teal}40`,
                  borderRadius:12, padding:"14px 16px", marginTop:14, marginBottom:14,
                }}>
                  <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
                    Your next move
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.white, marginBottom:6 }}>
                    🚀 Deploy {fmtFull(deployable)} to your Growth Engine
                  </div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6 }}>
                    Open your NISA or brokerage account. Route exactly {fmtFull(deployable)} into a broad-based index fund.
                    Your oxygen tank stays untouched in your HYSA. You are protected on both sides.
                  </div>
                </div>
                <Btn color={T.teal} onClick={() => alert("→ Lesson 1-1: The Capital Myth unlocked!")}>
                  Continue to Lesson 1-1 →
                </Btn>
              </Card>
            )}

            {/* AMBER — needs more oxygen first */}
            {!oxygenFull && (
              <Card borderColor={T.amber}>
                <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                  <div style={{ fontSize:52, marginBottom:10 }}>🛸</div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.amber, marginBottom:6 }}>
                    Fill the tank first.
                  </div>
                  <div style={{ fontSize:14, color:T.offWhite, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>
                    You understand the rule. Now your job is to execute it before deploying to the market.
                  </div>
                </div>
                <Hr />

                {/* Shortfall hero stat */}
                <div style={{
                  background:`${T.amber}12`, border:`2px solid ${T.amber}`,
                  borderRadius:14, padding:"20px", textAlign:"center", marginBottom:16,
                }}>
                  <div style={{ fontSize:12, color:T.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                    Amount needed to unlock investing
                  </div>
                  <div style={{ fontSize:40, fontWeight:900, color:T.amber, marginBottom:4 }}>
                    {fmtFull(shortfall)}
                  </div>
                  <div style={{ fontSize:12, color:T.offWhite }}>
                    Once your HYSA holds {fmtFull(oxygenTarget)}, your oxygen tank is full.
                    Every yen after that goes straight to the market.
                  </div>
                </div>

                <VRow icon="🛸" color={T.oxygen} label="Current cash"        value={fmtFull(currentCash)} />
                <VRow icon="🎯" color={T.amber}  label="Oxygen Tank target"  value={fmtFull(oxygenTarget)} />
                <VRow icon="⚠" color={T.amber}  label="Shortfall"           value={fmtFull(shortfall)} />

                {/* Quest card */}
                <div style={{
                  background:`${T.amber}12`, border:`1px solid ${T.amber}40`,
                  borderRadius:12, padding:"14px 16px", marginTop:14, marginBottom:14,
                }}>
                  <div style={{ fontSize:11, color:T.amber, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
                    Your current quest
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.white, marginBottom:6 }}>
                    🛸 Build the {fmtFull(oxygenTarget)} Oxygen Tank
                  </div>
                  <div style={{ fontSize:13, color:T.offWhite, lineHeight:1.6 }}>
                    Open a High-Yield Savings Account. Set up an automatic transfer until you hit {fmtFull(oxygenTarget)}.
                    Come back when it's full — your {monthsTarget}-month shield will be in place and you'll
                    have a green light to deploy to the market with zero fear of getting trapped.
                  </div>
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <Btn color={T.amber} style={{ flex:1, color:T.navy }}
                    onClick={() => alert("→ HYSA setup guide")}>
                    Set up my HYSA
                  </Btn>
                  <Btn color={T.navyCard} style={{ flex:1, border:`1px solid ${T.slate}33` }}
                    onClick={() => setPart(3)}>
                    Adjust numbers
                  </Btn>
                </div>
              </Card>
            )}

            <button onClick={() => setPart(0)} style={{
              display:"block", margin:"20px auto 0",
              background:"none", border:"none", color:T.slate,
              fontSize:12, cursor:"pointer", textDecoration:"underline",
            }}>← Start lesson over</button>
          </Fade>
        )}

      </div>
    </div>
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
