import { useState, useEffect } from "react";

// ─── Persistence helpers ───────────────────────────────────────────────────
const STORAGE_KEY = "bryan_career_tracker_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — fail silently
  }
}
// ──────────────────────────────────────────────────────────────────────────

// ─── Design Tokens ─────────────────────────────────────────────────────────
const T = {
  ink:          "#1C1C1E",
  ink2:         "#3A3A3C",
  ink3:         "#636366",
  ink4:         "#AEAEB2",
  fill1:        "#F2F2F7",
  fill2:        "#E5E5EA",
  fill3:        "#D1D1D6",
  white:        "#FFFFFF",
  accent:       "#1A4ED8",
  accentLight:  "#EEF2FF",
  purple:       "#7C3AED",
  purpleLight:  "#F5F3FF",
  green:        "#065F46",
  greenLight:   "#ECFDF5",
  amber:        "#92400E",
  amberLight:   "#FEF3C7",
  red:          "#991B1B",
  redLight:     "#FEF2F2",
  separator:    "rgba(60,60,67,0.12)",
  shadowSm:     "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:     "0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  fontDisplay:  "'DM Serif Display', Georgia, serif",
  fontBody:     "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  radiusSm:     "8px",
  radiusMd:     "12px",
  radiusLg:     "16px",
  radiusXl:     "22px",
};

// Card style helper (module-level since T is also module-level)
const card = (extra = {}) => ({
  background: T.white,
  borderRadius: T.radiusLg,
  boxShadow: T.shadowSm,
  border: `1px solid ${T.separator}`,
  ...extra,
});

// ─── Data ──────────────────────────────────────────────────────────────────
const WEEKS = [
  {
    week: 1,
    title: "The Mirror",
    theme: "Radical Self-Audit",
    gervais: "Identify Your Clueless Behaviors",
    overview: "Goldsmith's core insight: successful people believe their success is caused by their behaviors — so they keep doing them. Week 1 is about brutally auditing what got you here and what's holding you back from the next level.",
    habits: [
      "Stop Adding Too Much Value — notice every time you add to someone's idea",
      "Stop Telling the World How Smart You Are",
      "Stop Claiming Credit You Don't Deserve",
    ],
    actions: [
      "List your 3 greatest career wins. For each, identify what behavior drove it.",
      "Ask 3 peers: 'What's one thing I do that might be holding me back?' (written, anonymous)",
      "Journal: What do I do in meetings that signals status vs. generates value?",
      "Map your stakeholder web — who are your Sociopaths, Clueless, and Losers?",
    ],
    gervaisNote: "The Gervais Principle says organizations are stratified: Sociopaths (top, use people), Clueless (middle, believe the mission), Losers (bottom, trade time for security). As a Manager at Disney, you're likely perceived as Clueless-adjacent unless you're visibly playing a larger game. This week: figure out which behaviors signal each tier.",
    reflection: "What am I doing that a Sociopath would find naive — and is that serving me?",
    kpi: "360 feedback collected from 3 people. Self-audit doc completed.",
  },
  {
    week: 2,
    title: "The Feedback Loop",
    theme: "Stop Punishing the Messenger",
    gervais: "Understand the Information Game",
    overview: "Most leaders destroy their own feedback loops. People stop telling you the truth. Goldsmith's 20 habits all involve interpersonal failure — not technical failure. This week you rewire how you receive information.",
    habits: [
      "Stop Passing Judgment — eliminate 'Great idea, BUT...'",
      "Stop Starting with 'No', 'But', or 'However'",
      "Stop Making Destructive Comments",
    ],
    actions: [
      "In every meeting this week: write down every time you respond with a qualifier instead of acknowledgment.",
      "Practice 'Thank you' as a complete response to feedback — no defense.",
      "Identify one person you've subtly dismissed. Have a real listening conversation.",
      "In Confluence/Loop: document a decision someone else made that you'd have done differently — and don't share it.",
    ],
    gervaisNote: "Sociopaths control information asymmetry. They share selectively. Clueless leaders over-share and signal their own confusion. This week: observe who controls information in your org and how they do it without appearing to.",
    reflection: "Where am I leaking power by being too transparent or too reactive?",
    kpi: "Zero qualifying openers in 3+ meetings. One real listening conversation logged.",
  },
  {
    week: 3,
    title: "The Scorecard",
    theme: "Feedforward Over Feedback",
    gervais: "Play the Long Game",
    overview: "Goldsmith's 'feedforward' technique: instead of rehashing the past, ask people what you could do differently in the future. This is both humbler and more useful — and it signals executive maturity.",
    habits: [
      "Stop Punishing the Messenger",
      "Stop Withholding Information (selectively)",
      "Stop the Need to Win — even when it doesn't matter",
    ],
    actions: [
      "Run feedforward with 5 people: 'I'm working on being more [X]. What are 2 suggestions for how I could improve?'",
      "Identify one recurring conflict where you always 'win.' Decide to let it go.",
      "Write a 'Leader I Want to Become' one-pager (for yourself only).",
      "Review your portfolio — what are you holding too tightly that a PM should own?",
    ],
    gervaisNote: "In the Gervais model, moving up requires making yourself less visible in the details while becoming more visible in the framing. Feedforward is how Sociopaths cultivate loyalty — they ask for help, make people feel heard, and disappear the transaction.",
    reflection: "Where am I optimizing for being right instead of being effective?",
    kpi: "Feedforward sessions completed with 5 people. One-pager drafted.",
  },
  {
    week: 4,
    title: "The Apology",
    theme: "Clean Up the Past",
    gervais: "Manage Reputation Debt",
    overview: "High performers accumulate relational debt they don't notice — because the people they've alienated don't tell them. This week is about auditing and paying down that debt intentionally.",
    habits: [
      "Stop Refusing to Express Regret",
      "Stop Not Listening",
      "Stop Failing to Give Proper Recognition",
    ],
    actions: [
      "Identify 3 people you may have undervalued, dismissed, or taken credit from. Acknowledge it — specifically.",
      "Proactively give public credit for 2 team wins you had a hand in.",
      "In your next 1:1s, spend the first 10 minutes just listening — no agenda, no advice.",
      "Send one Goldsmith-style 'thank you' note to someone who shaped your career.",
    ],
    gervaisNote: "Reputation debt compounds. Sociopaths clean it up early and strategically — not out of guilt but because it's a liability. Clueless managers often don't realize the debt exists. This week you're doing an audit that most managers never do.",
    reflection: "Who in my network has quietly pulled back — and why?",
    kpi: "3 acknowledgment conversations had. 2 public credit moments logged.",
  },
  {
    week: 5,
    title: "The Mission",
    theme: "Identify What Needs to Change",
    gervais: "Define Your Tier-Jump Strategy",
    overview: "Goldsmith says the #1 challenge isn't knowing what to change — it's committing to change it. Most leaders pick one or two habits to improve then backslide. This week: build your change architecture.",
    habits: [
      "Stop Making Excuses",
      "Stop Clinging to the Past",
      "Stop Playing Favorites",
    ],
    actions: [
      "Pick your ONE keystone habit to change (from the audit). Write the exact behavioral trigger.",
      "Define what 'Director-level presence' looks like in YOUR org — specific behaviors, not titles.",
      "Identify your Sociopath sponsors — who decides if you move up?",
      "Map 3 moves to increase your visibility to those sponsors in the next 60 days.",
    ],
    gervaisNote: "The Gervais Principle is clear: you don't get promoted by working harder at your current level. You get promoted by demonstrating that you're already playing the game at the next level. This week: define that game explicitly.",
    reflection: "What would I be doing differently next week if I already had the Director title?",
    kpi: "One keystone habit identified. Sponsor map completed. 3 visibility moves planned.",
  },
  {
    week: 6,
    title: "The Environment",
    theme: "Structure Your Change",
    gervais: "Build Systems Over Willpower",
    overview: "Goldsmith: 'Behavior change doesn't happen through willpower alone — it happens through environmental design.' This week you build the scaffolding that makes the new behavior automatic.",
    habits: [
      "Stop Withholding Information",
      "Stop Not Expressing Gratitude",
      "Stop Excessive Need to Be Me",
    ],
    actions: [
      "Create a daily 2-min check-in ritual: 'Did I exhibit my keystone habit today? What triggered it?'",
      "Build a weekly recognition practice into your Friday routine (Slack/email).",
      "Add a 'What I'm delegating' column to your weekly status — visible to your leader.",
      "Schedule monthly 15-min 'career coaching' conversations with each PM on your team.",
    ],
    gervaisNote: "Sociopaths don't rely on motivation — they build structures that generate the outcomes they want. A recognition system, a delegation tracker, and visible coaching activity are all signals of next-level leadership — and they create organizational leverage.",
    reflection: "What structures do I need to build so the new behavior runs on autopilot?",
    kpi: "Daily check-in ritual active for 5 days. Recognition practice logged. Delegation column added.",
  },
  {
    week: 7,
    title: "The Accountability",
    theme: "Announce the Change",
    gervais: "Create External Accountability",
    overview: "Goldsmith's most counterintuitive advice: tell people what you're working on. Most leaders hide their development goals out of fear. Public commitment creates follow-through AND changes how others perceive you.",
    habits: [
      "Stop Goal Obsession (at the expense of people)",
      "Stop Ignoring Others' Goals",
    ],
    actions: [
      "Tell your manager: 'I'm working on [X]. I'd appreciate feedback over the next 30 days.'",
      "Tell one direct report: 'I'm working on being a better listener. Call me out when I don't.'",
      "In your book club: share one personal insight from the Goldsmith framework.",
      "Update your self-review language to reflect the behavioral change you're making.",
    ],
    gervaisNote: "This is a Sociopath move: publicly naming your growth agenda signals self-awareness and confidence — two markers of someone operating above their current tier. It also forces your organization to see you as dynamic, not static.",
    reflection: "What am I afraid people will think if I admit I'm working on something?",
    kpi: "Manager conversation had. One direct report enrolled as accountability partner.",
  },
  {
    week: 8,
    title: "The Measurement",
    theme: "Assess and Recalibrate",
    gervais: "Score the Game You're Playing",
    overview: "At week 8 you have enough data to assess real change. Goldsmith recommends a mini 360 — not formal, just directional. This week is about measuring, celebrating progress, and identifying where you've backslid.",
    habits: [
      "All 20 habits — reassess which still apply",
    ],
    actions: [
      "Re-ask your week 1 feedback sources: 'Have you noticed any change in [X]?'",
      "Score yourself 1-10 on each of the 5 habits you identified as highest priority.",
      "Write a 'State of My Leadership' memo — for your eyes only.",
      "Identify your next keystone habit for the following 8-week cycle.",
    ],
    gervaisNote: "The Gervais Principle says most people plateau because they optimize for the wrong scorecard — the company's scorecard instead of their own career trajectory scorecard. Today: make sure you're measuring the right things.",
    reflection: "If my skip-level watched me for the past 8 weeks, what story would they tell about my trajectory?",
    kpi: "Mini-360 completed. Self-score on 5 habits. Next cycle's habit identified.",
  },
];

const GOLDSMITH_HABITS = [
  "Winning Too Much",
  "Adding Too Much Value",
  "Passing Judgment",
  "Making Destructive Comments",
  "Starting with 'No', 'But', or 'However'",
  "Telling the World How Smart You Are",
  "Speaking When Angry",
  "Negativity (Let Me Explain Why That Won't Work)",
  "Withholding Information",
  "Failing to Give Proper Recognition",
  "Claiming Credit You Don't Deserve",
  "Making Excuses",
  "Clinging to the Past",
  "Playing Favorites",
  "Refusing to Express Regret",
  "Not Listening",
  "Failing to Express Gratitude",
  "Punishing the Messenger",
  "Passing the Buck",
  "An Excessive Need to Be 'Me'",
];

const TABS = [
  { id: "dashboard", label: "Dashboard"   },
  { id: "plan",      label: "8-Week Plan" },
  { id: "habits",    label: "Habit Audit" },
  { id: "checkin",   label: "Check-In"   },
  { id: "progress",  label: "Progress"   },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function CareerGrowthTracker() {
  const persisted = loadState();

  const [activeView,   setActiveView]   = useState(persisted?.activeView   ?? "dashboard");
  const [currentWeek,  setCurrentWeek]  = useState(persisted?.currentWeek  ?? 1);
  const [weekData,     setWeekData]     = useState(() => {
    if (persisted?.weekData) return persisted.weekData;
    const saved = {};
    WEEKS.forEach(w => { saved[w.week] = { completed: [], reflection: "", rating: 0 }; });
    return saved;
  });
  const [habitRatings, setHabitRatings] = useState(() => {
    if (persisted?.habitRatings) return persisted.habitRatings;
    const r = {};
    GOLDSMITH_HABITS.forEach(h => (r[h] = 0));
    return r;
  });
  const [checkinWeek,    setCheckinWeek]    = useState(persisted?.checkinWeek ?? null);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Auto-save
  useEffect(() => {
    saveState({ activeView, currentWeek, weekData, habitRatings, checkinWeek });
    setSavedIndicator(true);
    const t = setTimeout(() => setSavedIndicator(false), 1500);
    return () => clearTimeout(t);
  }, [activeView, currentWeek, weekData, habitRatings, checkinWeek]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const toggleAction = (week, action) => {
    setWeekData(prev => {
      const existing = prev[week].completed || [];
      const has = existing.includes(action);
      return {
        ...prev,
        [week]: {
          ...prev[week],
          completed: has ? existing.filter(a => a !== action) : [...existing, action],
        },
      };
    });
  };

  const setReflection = (week, val) =>
    setWeekData(prev => ({ ...prev, [week]: { ...prev[week], reflection: val } }));

  const setRating = (week, val) =>
    setWeekData(prev => ({ ...prev, [week]: { ...prev[week], rating: val } }));

  const overallProgress = () => {
    let total = 0, done = 0;
    WEEKS.forEach(w => {
      total += w.actions.length;
      done  += (weekData[w.week]?.completed || []).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  const weekProgress = (wk) => {
    const w = WEEKS.find(x => x.week === wk);
    if (!w) return 0;
    const done = (weekData[wk]?.completed || []).length;
    return Math.round((done / w.actions.length) * 100);
  };

  const weekObj = WEEKS.find(w => w.week === currentWeek);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: T.fill1,
      fontFamily: T.fontBody,
      color: T.ink,
      WebkitFontSmoothing: "antialiased",
    }}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.separator}`,
        padding: "14px 40px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "3px" }}>
            Bryan Rosenfarb · Career Architect
          </div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: "22px", color: T.ink, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            What Got You Here, Won't Get You There
          </div>
          <div style={{ fontSize: "11px", color: T.ink4, marginTop: "3px" }}>
            8-Week Leadership Transformation + Gervais Framework
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 500,
            color: savedIndicator ? T.green : "transparent",
            transition: "color 0.3s",
          }}>
            ✓ Saved
          </span>

          <div style={card({ padding: "10px 18px", textAlign: "center" })}>
            <div style={{ fontFamily: T.fontDisplay, fontSize: "26px", color: T.accent, lineHeight: 1 }}>
              {overallProgress()}%
            </div>
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, marginTop: "3px", textTransform: "uppercase" }}>
              Progress
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Reset ALL progress? This cannot be undone.")) {
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload();
              }
            }}
            style={{
              fontSize: "12px", fontWeight: 500, color: T.red,
              background: T.redLight, border: `1px solid rgba(153,27,27,0.2)`,
              borderRadius: T.radiusMd, padding: "8px 14px", cursor: "pointer",
              fontFamily: T.fontBody, transition: "all 0.15s",
            }}
          >
            Reset Data
          </button>
        </div>
      </header>

      {/* ── TAB NAV ───────────────────────────────────────────────────── */}
      <nav style={{
        background: T.white,
        borderBottom: `1px solid ${T.separator}`,
        padding: "0 40px",
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              padding: "13px 22px",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeView === tab.id ? T.accent : "transparent"}`,
              color: activeView === tab.id ? T.accent : T.ink3,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: T.fontBody,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── MAIN ──────────────────────────────────────────────────────── */}
      <main style={{ padding: "28px 40px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ════════════════════════════ DASHBOARD ════════════════════════════ */}
        {activeView === "dashboard" && (
          <div>
            {/* Hero gradient card */}
            <div style={{
              background: "linear-gradient(135deg, #1A4ED8 0%, #1e3a8a 100%)",
              borderRadius: T.radiusLg,
              padding: "32px 36px",
              marginBottom: "20px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", opacity: 0.7, textTransform: "uppercase", marginBottom: "8px" }}>
                  LeaderShift Program
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: "30px", letterSpacing: "-0.3px", marginBottom: "6px" }}>
                  8-Week Transformation
                </div>
                <div style={{ fontSize: "14px", opacity: 0.8 }}>
                  Goldsmith's 20 Habits · Gervais Framework
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: "58px", lineHeight: 1 }}>
                  {overallProgress()}%
                </div>
                <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Overall Progress
                </div>
                <div style={{ marginTop: "10px", height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.2)", width: "160px", marginLeft: "auto" }}>
                  <div style={{ height: "100%", width: `${overallProgress()}%`, background: "white", borderRadius: "3px", transition: "width 0.4s ease" }} />
                </div>
              </div>
            </div>

            {/* Theory brief */}
            <div style={{ ...card({ padding: 0, overflow: "hidden" }), marginBottom: "20px" }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.separator}` }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "4px" }}>
                  Frameworks at Work
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: "20px", color: T.ink }}>
                  The Theory Behind the Practice
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: T.accent, marginBottom: "8px", letterSpacing: "0.3px" }}>
                    Goldsmith's Core Premise
                  </div>
                  <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.75" }}>
                    The behaviors that made you successful at your current level are often the same behaviors that will prevent you from reaching the next level. Success creates belief. Belief creates blindspots. This program targets those blindspots — specifically the interpersonal habits that erode executive presence.
                  </div>
                </div>
                <div style={{ padding: "20px 24px", borderLeft: `1px solid ${T.separator}` }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: T.purple, marginBottom: "8px", letterSpacing: "0.3px" }}>
                    The Gervais Principle Applied
                  </div>
                  <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.75" }}>
                    Venkat Rao's model: organizations are run by Sociopaths (who use the system), managed by Clueless (who believe in it), staffed by Losers (who trade effort for security). Moving from Clueless to Sociopath tier requires playing a fundamentally different game — strategic, less visible in details, more visible in framing.
                  </div>
                </div>
              </div>
            </div>

            {/* 8-Week overview grid */}
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "12px" }}>
              8-Week Overview
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {WEEKS.map(w => {
                const pct      = weekProgress(w.week);
                const isActive = currentWeek === w.week;
                return (
                  <div
                    key={w.week}
                    onClick={() => { setCurrentWeek(w.week); setActiveView("plan"); }}
                    style={{
                      ...card({
                        padding: "16px",
                        cursor: "pointer",
                        border: isActive ? `2px solid ${T.accent}` : `1px solid ${T.separator}`,
                        boxShadow: isActive ? `0 0 0 3px ${T.accentLight}, ${T.shadowSm}` : T.shadowSm,
                        transition: "all 0.15s",
                      }),
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{
                        fontSize: "9px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                        color: T.accent, background: T.accentLight, padding: "2px 8px", borderRadius: "20px",
                      }}>
                        Wk {w.week}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: pct === 100 ? T.green : T.ink4 }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: "14px", color: T.ink, marginBottom: "2px", lineHeight: 1.3 }}>{w.title}</div>
                    <div style={{ fontSize: "11px", color: T.ink3, marginBottom: "12px" }}>{w.theme}</div>
                    <div style={{ height: "3px", borderRadius: "2px", background: T.fill2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: pct === 100 ? T.green : T.accent,
                        borderRadius: "2px", transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gervais Tier Map */}
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "12px" }}>
              Gervais Tier Map — Where Are You Now?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                {
                  tier: "Sociopath",
                  color: T.purple, bg: T.purpleLight,
                  desc: "Plays the long game. Uses systems. Invisible in details, visible in outcomes. Controls information asymmetry.",
                  signal: "Sponsors careers. Makes strategic bets. Rarely defends their choices.",
                },
                {
                  tier: "Clueless",
                  color: T.accent, bg: T.accentLight,
                  desc: "Believes in the mission. Works hard. Optimizes the wrong scorecard. Visible in execution.",
                  signal: "Explains their reasoning. Adds value in meetings. Needs to be seen as smart.",
                  current: true,
                },
                {
                  tier: "Loser",
                  color: T.ink3, bg: T.fill1,
                  desc: "Trades time for security. Disengaged from politics. Preserves optionality by not over-investing.",
                  signal: "Quietly expert. Avoids visibility. Not a management candidate.",
                },
              ].map(t => (
                <div
                  key={t.tier}
                  style={card({
                    padding: "20px",
                    border: t.current ? `2px solid ${T.accent}` : `1px solid ${T.separator}`,
                  })}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                    <div style={{ fontFamily: T.fontDisplay, fontSize: "17px", color: T.ink }}>{t.tier}</div>
                    {t.current && (
                      <span style={{
                        fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
                        color: T.accent, background: T.accentLight, padding: "2px 8px", borderRadius: "20px", marginLeft: "auto",
                      }}>
                        You → Target ↑
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: T.ink3, lineHeight: "1.65", marginBottom: "12px" }}>{t.desc}</div>
                  <div style={{
                    fontSize: "11px", fontStyle: "italic", lineHeight: "1.5",
                    color: t.color, background: t.bg, borderRadius: T.radiusSm, padding: "8px 12px",
                  }}>
                    "{t.signal}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════ 8-WEEK PLAN ══════════════════════════ */}
        {activeView === "plan" && weekObj && (
          <div>
            {/* Week chips */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {WEEKS.map(w => {
                const isActive = currentWeek === w.week;
                return (
                  <button
                    key={w.week}
                    onClick={() => setCurrentWeek(w.week)}
                    style={{
                      padding: "7px 14px",
                      background: isActive ? T.accent : T.white,
                      border: `1px solid ${isActive ? T.accent : T.separator}`,
                      borderRadius: "20px",
                      color: isActive ? "white" : T.ink3,
                      cursor: "pointer", fontSize: "12px", fontWeight: 500,
                      fontFamily: T.fontBody, transition: "all 0.15s",
                      boxShadow: isActive ? T.shadowSm : "none",
                    }}
                  >
                    Wk {w.week}: {w.title}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
              {/* ── Left column ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Week header */}
                <div style={card({ padding: "24px" })}>
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    background: T.accentLight, borderRadius: "20px", padding: "3px 10px", marginBottom: "12px",
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: T.accent }}>Week {weekObj.week} of 8</span>
                  </div>
                  <h2 style={{ fontFamily: T.fontDisplay, fontSize: "24px", color: T.ink, margin: "0 0 4px", fontWeight: 400 }}>
                    {weekObj.title}
                  </h2>
                  <div style={{ fontSize: "14px", color: T.ink3, fontWeight: 500, marginBottom: "16px" }}>{weekObj.theme}</div>
                  <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.8", borderTop: `1px solid ${T.separator}`, paddingTop: "16px" }}>
                    {weekObj.overview}
                  </div>
                </div>

                {/* Habits targeted */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                    Habits Targeted This Week
                  </div>
                  {weekObj.habits.map((h, i) => (
                    <div
                      key={h}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "11px 0",
                        borderBottom: i < weekObj.habits.length - 1 ? `1px solid ${T.separator}` : "none",
                      }}
                    >
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.purple, flexShrink: 0 }} />
                      <div style={{ fontSize: "13px", color: T.ink2, lineHeight: "1.4" }}>{h}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                    This Week's Actions
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {weekObj.actions.map(a => {
                      const done = (weekData[weekObj.week]?.completed || []).includes(a);
                      return (
                        <div
                          key={a}
                          onClick={() => toggleAction(weekObj.week, a)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: "12px",
                            background: done ? T.greenLight : T.fill1,
                            border: `1px solid ${done ? "rgba(6,95,70,0.2)" : T.separator}`,
                            borderRadius: T.radiusMd, padding: "13px 16px",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                        >
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "5px",
                            flexShrink: 0, marginTop: "1px",
                            border: `2px solid ${done ? T.green : T.fill3}`,
                            background: done ? T.green : T.white,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                          }}>
                            {done && <span style={{ color: "white", fontSize: "10px", lineHeight: 1, fontWeight: 700 }}>✓</span>}
                          </div>
                          <div style={{
                            fontSize: "13px",
                            color: done ? T.green : T.ink2,
                            lineHeight: "1.6",
                            textDecoration: done ? "line-through" : "none",
                          }}>
                            {a}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gervais insight */}
                <div style={{
                  background: T.purpleLight,
                  border: `1px solid rgba(124,58,237,0.2)`,
                  borderLeft: `4px solid ${T.purple}`,
                  borderRadius: T.radiusLg,
                  padding: "20px",
                }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.purple, textTransform: "uppercase", marginBottom: "10px" }}>
                    Gervais Principle · {weekObj.gervais}
                  </div>
                  <div style={{ fontSize: "13px", color: T.ink2, lineHeight: "1.8" }}>{weekObj.gervaisNote}</div>
                </div>

                {/* Reflection */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "12px" }}>
                    Weekly Reflection Prompt
                  </div>
                  <div style={{
                    fontSize: "14px", fontStyle: "italic", color: T.amber,
                    background: T.amberLight, border: `1px solid rgba(146,64,14,0.15)`,
                    borderRadius: T.radiusMd, padding: "14px 16px", marginBottom: "12px", lineHeight: "1.6",
                  }}>
                    "{weekObj.reflection}"
                  </div>
                  <textarea
                    value={weekData[weekObj.week]?.reflection || ""}
                    onChange={e => setReflection(weekObj.week, e.target.value)}
                    placeholder="Your reflection..."
                    style={{
                      width: "100%", minHeight: "100px",
                      background: T.fill1, border: `1.5px solid ${T.fill3}`,
                      borderRadius: T.radiusMd, color: T.ink,
                      padding: "12px 14px", fontSize: "13px",
                      fontFamily: T.fontBody, lineHeight: "1.7",
                      resize: "vertical", boxSizing: "border-box",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = T.accent;
                      e.target.style.boxShadow = `0 0 0 3px ${T.accentLight}`;
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = T.fill3;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* ── Right sidebar ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* KPI */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "12px" }}>
                    Success Metrics
                  </div>
                  <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.8" }}>{weekObj.kpi}</div>
                </div>

                {/* Progress */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "16px" }}>
                    Week {weekObj.week} Progress
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: "40px", color: T.accent, lineHeight: 1 }}>
                      {weekProgress(weekObj.week)}%
                    </div>
                    <div style={{ fontSize: "12px", color: T.ink4, marginTop: "4px" }}>
                      {(weekData[weekObj.week]?.completed || []).length} / {weekObj.actions.length} actions
                    </div>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: T.fill2 }}>
                    <div style={{
                      height: "100%",
                      width: `${weekProgress(weekObj.week)}%`,
                      background: weekProgress(weekObj.week) === 100 ? T.green : T.accent,
                      borderRadius: "3px", transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>

                {/* Self-rating */}
                <div style={card({ padding: "20px" })}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                    Self-Rating This Week
                  </div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    {[1,2,3,4,5].map(n => {
                      const rated = (weekData[weekObj.week]?.rating || 0) >= n;
                      return (
                        <button
                          key={n}
                          onClick={() => setRating(weekObj.week, n)}
                          style={{
                            width: "40px", height: "40px", borderRadius: T.radiusSm,
                            background: rated ? T.accentLight : T.fill1,
                            border: `1px solid ${rated ? T.accent : T.fill3}`,
                            color: rated ? T.accent : T.ink4,
                            cursor: "pointer", fontSize: "18px",
                            fontFamily: T.fontBody, transition: "all 0.15s",
                          }}
                        >★</button>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: "center", fontSize: "12px", color: T.ink4, marginTop: "10px", fontWeight: 500 }}>
                    {["", "Struggled", "Below target", "On track", "Strong week", "Breakthrough"][weekData[weekObj.week]?.rating || 0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════ HABIT AUDIT ══════════════════════════ */}
        {activeView === "habits" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: "24px", color: T.ink, margin: "0 0 6px", fontWeight: 400 }}>
                Goldsmith's 20 Habits — Self Audit
              </h2>
              <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.7" }}>
                Rate yourself on each habit: 1 = rarely an issue, 5 = this is me in most meetings. Higher scores = higher priority to address first.
              </div>
            </div>

            <div style={card({ padding: 0, overflow: "hidden" })}>
              {GOLDSMITH_HABITS.map((h, i) => {
                const rating = habitRatings[h] || 0;
                const isHigh = rating >= 4;
                return (
                  <div
                    key={h}
                    style={{
                      display: "grid", gridTemplateColumns: "28px 1fr auto",
                      alignItems: "center", gap: "16px",
                      padding: "12px 20px",
                      background: isHigh ? "rgba(153,27,27,0.03)" : T.white,
                      borderBottom: i < GOLDSMITH_HABITS.length - 1 ? `1px solid ${T.separator}` : "none",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: T.ink4, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: "13px", color: isHigh ? T.red : T.ink2, fontWeight: isHigh ? 500 : 400 }}>
                      {h}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1,2,3,4,5].map(n => {
                        const active = rating >= n;
                        return (
                          <button
                            key={n}
                            onClick={() => setHabitRatings(prev => ({ ...prev, [h]: n }))}
                            style={{
                              width: "28px", height: "28px", borderRadius: "6px",
                              background: active ? (isHigh ? T.redLight  : T.accentLight) : T.fill1,
                              border: `1px solid ${active ? (isHigh ? "rgba(153,27,27,0.3)" : "rgba(26,78,216,0.25)") : T.fill3}`,
                              color: active ? (isHigh ? T.red : T.accent) : T.ink4,
                              cursor: "pointer", fontSize: "12px", fontWeight: 600,
                              fontFamily: T.fontBody, transition: "all 0.1s",
                            }}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {Object.values(habitRatings).some(v => v > 0) && (
              <div style={{ ...card({ padding: "20px" }), marginTop: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                  Your Top Priority Habits
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {Object.entries(habitRatings)
                    .filter(([, v]) => v >= 3)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([h, v], i, arr) => (
                      <div
                        key={h}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "11px 0",
                          borderBottom: i < arr.length - 1 ? `1px solid ${T.separator}` : "none",
                        }}
                      >
                        <span style={{ fontSize: "13px", color: T.ink2 }}>{h}</span>
                        <span style={{
                          fontSize: "11px", fontWeight: 600,
                          color: v >= 4 ? T.red : T.amber,
                          background: v >= 4 ? T.redLight : T.amberLight,
                          padding: "2px 10px", borderRadius: "20px",
                        }}>
                          {"★".repeat(v)} {v}/5
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════ CHECK-IN ════════════════════════════ */}
        {activeView === "checkin" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: "24px", color: T.ink, margin: "0 0 6px", fontWeight: 400 }}>
                Weekly Check-In
              </h2>
              <div style={{ fontSize: "13px", color: T.ink3 }}>
                Use this every Friday to assess the week and set intention for the next.
              </div>
            </div>

            {/* Week chips */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {WEEKS.map(w => {
                const isActive = checkinWeek === w.week;
                return (
                  <button
                    key={w.week}
                    onClick={() => setCheckinWeek(w.week === checkinWeek ? null : w.week)}
                    style={{
                      padding: "7px 14px",
                      background: isActive ? T.accent : T.white,
                      border: `1px solid ${isActive ? T.accent : T.separator}`,
                      borderRadius: "20px",
                      color: isActive ? "white" : T.ink3,
                      cursor: "pointer", fontSize: "12px", fontWeight: 500,
                      fontFamily: T.fontBody, transition: "all 0.15s",
                    }}
                  >
                    Week {w.week}
                  </button>
                );
              })}
            </div>

            {checkinWeek && (() => {
              const w = WEEKS.find(x => x.week === checkinWeek);
              const d = weekData[checkinWeek];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Week summary */}
                  <div style={card({ padding: "24px" })}>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                      Week {checkinWeek} Summary
                    </div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: "20px", color: T.ink, marginBottom: "2px" }}>{w.title}</div>
                    <div style={{ fontSize: "12px", color: T.ink3, marginBottom: "16px" }}>{w.theme}</div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: T.ink4, marginBottom: "8px" }}>
                        <span>Actions completed</span>
                        <span style={{ fontWeight: 600, color: T.ink2 }}>{(d?.completed || []).length} / {w.actions.length}</span>
                      </div>
                      <div style={{ height: "5px", borderRadius: "3px", background: T.fill2 }}>
                        <div style={{
                          height: "100%", width: `${weekProgress(checkinWeek)}%`,
                          background: weekProgress(checkinWeek) === 100 ? T.green : T.accent,
                          borderRadius: "3px", transition: "width 0.4s",
                        }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: `1px solid ${T.separator}` }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: T.ink4, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        Self-Rating
                      </div>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {[1,2,3,4,5].map(n => (
                          <span key={n} style={{ fontSize: "20px", color: (d?.rating || 0) >= n ? T.accent : T.fill3 }}>★</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: T.ink4, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        KPI Target
                      </div>
                      <div style={{ fontSize: "12px", color: T.ink3, lineHeight: "1.7" }}>{w.kpi}</div>
                    </div>
                  </div>

                  {/* Reflection */}
                  <div style={card({ padding: "24px" })}>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "14px" }}>
                      Your Reflection
                    </div>
                    {d?.reflection ? (
                      <div style={{
                        fontSize: "13px", color: T.ink2, lineHeight: "1.8",
                        fontStyle: "italic", background: T.fill1,
                        borderRadius: T.radiusMd, padding: "16px",
                        borderLeft: `3px solid ${T.accent}`,
                      }}>
                        "{d.reflection}"
                      </div>
                    ) : (
                      <div style={{ fontSize: "13px", color: T.ink4, fontStyle: "italic" }}>
                        No reflection recorded yet. Go to the Plan tab to add one.
                      </div>
                    )}

                    <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${T.separator}` }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: T.ink4, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        Prompt Reminder
                      </div>
                      <div style={{
                        fontSize: "13px", color: T.amber, fontStyle: "italic", lineHeight: "1.7",
                        background: T.amberLight, borderRadius: T.radiusMd, padding: "12px 14px",
                      }}>
                        "{w.reflection}"
                      </div>
                    </div>
                  </div>

                  {/* What's next */}
                  {checkinWeek < 8 && (
                    <div style={{ gridColumn: "1 / -1", ...card({ padding: "24px" }) }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.accent, textTransform: "uppercase", marginBottom: "12px" }}>
                        Next Up → Week {checkinWeek + 1}
                      </div>
                      <div style={{ fontFamily: T.fontDisplay, fontSize: "20px", color: T.ink, marginBottom: "6px" }}>
                        {WEEKS[checkinWeek].title}: {WEEKS[checkinWeek].theme}
                      </div>
                      <div style={{ fontSize: "13px", color: T.ink3, lineHeight: "1.7", marginBottom: "16px" }}>
                        {WEEKS[checkinWeek].overview}
                      </div>
                      <button
                        onClick={() => { setCurrentWeek(checkinWeek + 1); setActiveView("plan"); }}
                        style={{
                          padding: "11px 20px",
                          background: T.accent, color: "white",
                          border: "none", borderRadius: T.radiusMd,
                          cursor: "pointer", fontSize: "13px", fontWeight: 600,
                          fontFamily: T.fontBody,
                          boxShadow: "0 2px 8px rgba(26,78,216,0.3)",
                          transition: "all 0.15s",
                        }}
                      >
                        Open Week {checkinWeek + 1} Plan →
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {!checkinWeek && (
              <div style={{
                ...card({ padding: "60px" }),
                textAlign: "center", color: T.ink4, fontSize: "14px", fontStyle: "italic",
              }}>
                Select a week above to review your check-in
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════ PROGRESS ════════════════════════════ */}
        {activeView === "progress" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: "24px", color: T.ink, margin: "0 0 6px", fontWeight: 400 }}>
                Progress Overview
              </h2>
              <div style={{ fontSize: "13px", color: T.ink3 }}>
                Your aggregate progress across all 8 weeks of the LeaderShift program.
              </div>
            </div>

            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #1A4ED8 0%, #1e3a8a 100%)",
              borderRadius: T.radiusLg, padding: "28px 32px", marginBottom: "20px",
              display: "flex", alignItems: "center", justifyContent: "space-between", color: "white",
            }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", opacity: 0.7, textTransform: "uppercase", marginBottom: "8px" }}>
                  Overall Program Completion
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: "54px", lineHeight: 1 }}>
                  {overallProgress()}%
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: T.radiusMd, padding: "14px 20px", textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: "28px" }}>
                    {WEEKS.reduce((sum, w) => sum + (weekData[w.week]?.completed || []).length, 0)}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "3px" }}>Actions Done</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: T.radiusMd, padding: "14px 20px", textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: "28px" }}>
                    {WEEKS.filter(w => weekProgress(w.week) === 100).length}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "3px" }}>Weeks Complete</div>
                </div>
              </div>
            </div>

            {/* Week-by-week bars */}
            <div style={{ ...card({ padding: "24px" }), marginBottom: "20px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "20px" }}>
                Week-by-Week Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {WEEKS.map(w => {
                  const pct = weekProgress(w.week);
                  return (
                    <div
                      key={w.week}
                      style={{ display: "grid", gridTemplateColumns: "110px 1fr 44px", alignItems: "center", gap: "14px" }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: T.ink2 }}>Week {w.week}</div>
                        <div style={{ fontSize: "11px", color: T.ink4, marginTop: "1px" }}>{w.title}</div>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: T.fill2 }}>
                        <div style={{
                          height: "100%", width: `${pct}%`,
                          background: pct === 100 ? T.green : T.accent,
                          borderRadius: "3px", transition: "width 0.4s",
                        }} />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: pct === 100 ? T.green : T.ink3, textAlign: "right" }}>
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Self-ratings */}
            {WEEKS.some(w => weekData[w.week]?.rating > 0) && (
              <div style={card({ padding: "24px" })}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", color: T.ink4, textTransform: "uppercase", marginBottom: "16px" }}>
                  Self-Ratings by Week
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {WEEKS.map((w, i) => {
                    const r = weekData[w.week]?.rating || 0;
                    if (r === 0) return null;
                    return (
                      <div
                        key={w.week}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: i < WEEKS.length - 1 ? `1px solid ${T.separator}` : "none",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "13px", color: T.ink2, fontWeight: 500 }}>Week {w.week}: </span>
                          <span style={{ fontSize: "13px", color: T.ink3 }}>{w.title}</span>
                        </div>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[1,2,3,4,5].map(n => (
                            <span key={n} style={{ fontSize: "16px", color: r >= n ? T.accent : T.fill3 }}>★</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
