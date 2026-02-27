import { useState, useEffect, useCallback } from "react";

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

export default function CareerGrowthTracker() {
  // ── Load persisted state or fall back to defaults ──────────────────────
  const persisted = loadState();

  const [activeView, setActiveView] = useState(persisted?.activeView ?? "dashboard");
  const [currentWeek, setCurrentWeek] = useState(persisted?.currentWeek ?? 1);
  const [weekData, setWeekData] = useState(() => {
    if (persisted?.weekData) return persisted.weekData;
    const saved = {};
    WEEKS.forEach(w => { saved[w.week] = { completed: [], reflection: "", rating: 0 }; });
    return saved;
  });
  const [habitRatings, setHabitRatings] = useState(() => {
    if (persisted?.habitRatings) return persisted.habitRatings;
    const r = {};
    GOLDSMITH_HABITS.forEach(h => r[h] = 0);
    return r;
  });
  const [checkinWeek, setCheckinWeek] = useState(persisted?.checkinWeek ?? null);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // ── Auto-save whenever any tracked state changes ────────────────────────
  useEffect(() => {
    saveState({ activeView, currentWeek, weekData, habitRatings, checkinWeek });
    // Flash "Saved" indicator
    setSavedIndicator(true);
    const t = setTimeout(() => setSavedIndicator(false), 1500);
    return () => clearTimeout(t);
  }, [activeView, currentWeek, weekData, habitRatings, checkinWeek]);

  const toggleAction = (week, action) => {
    setWeekData(prev => {
      const existing = prev[week].completed || [];
      const has = existing.includes(action);
      return {
        ...prev,
        [week]: {
          ...prev[week],
          completed: has ? existing.filter(a => a !== action) : [...existing, action],
        }
      };
    });
  };

  const setReflection = (week, val) => {
    setWeekData(prev => ({ ...prev, [week]: { ...prev[week], reflection: val } }));
  };

  const setRating = (week, val) => {
    setWeekData(prev => ({ ...prev, [week]: { ...prev[week], rating: val } }));
  };

  const overallProgress = () => {
    let total = 0, done = 0;
    WEEKS.forEach(w => {
      total += w.actions.length;
      done += (weekData[w.week]?.completed || []).length;
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d0",
      position: "relative",
    }}>
      {/* Texture overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 20%, rgba(180,140,60,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(60,80,180,0.05) 0%, transparent 60%)",
      }} />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        borderBottom: "1px solid rgba(180,140,60,0.3)",
        padding: "24px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#b48c3c", textTransform: "uppercase", marginBottom: "4px" }}>
            Bryan Rosenfarb · Career Architect
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px", color: "#f0e8d8" }}>
            What Got You Here, Won't Get You There
          </div>
          <div style={{ fontSize: "11px", color: "#7a7060", marginTop: "2px", letterSpacing: "1px" }}>
            8-WEEK LEADERSHIP TRANSFORMATION + GERVAIS FRAMEWORK
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          {/* Saved indicator */}
          <div style={{
            fontSize: "10px", letterSpacing: "2px",
            color: savedIndicator ? "#5a9060" : "transparent",
            transition: "color 0.3s",
          }}>
            ✓ SAVED
          </div>
          <div style={{
            textAlign: "center",
            background: "rgba(180,140,60,0.1)",
            border: "1px solid rgba(180,140,60,0.3)",
            borderRadius: "8px",
            padding: "16px 24px",
          }}>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "#b48c3c", lineHeight: 1 }}>
              {overallProgress()}%
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#7a7060", marginTop: "4px" }}>
              OVERALL PROGRESS
            </div>
          </div>
          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm("Reset ALL progress? This cannot be undone.")) {
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload();
              }
            }}
            style={{
              fontSize: "9px", letterSpacing: "2px", color: "#5a4030",
              background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px", padding: "4px 10px", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            RESET ALL DATA
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", gap: "0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.3)",
      }}>
        {["dashboard", "plan", "habits", "checkin"].map(v => (
          <button key={v} onClick={() => setActiveView(v)} style={{
            padding: "14px 28px",
            background: activeView === v ? "rgba(180,140,60,0.15)" : "transparent",
            border: "none",
            borderBottom: activeView === v ? "2px solid #b48c3c" : "2px solid transparent",
            color: activeView === v ? "#b48c3c" : "#7a7060",
            cursor: "pointer",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}>
            {v === "dashboard" ? "Dashboard" : v === "plan" ? "8-Week Plan" : v === "habits" ? "Habit Audit" : "Weekly Check-In"}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* DASHBOARD */}
        {activeView === "dashboard" && (
          <div>
            {/* Theory Brief */}
            <div style={{
              background: "rgba(180,140,60,0.05)",
              border: "1px solid rgba(180,140,60,0.2)",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "32px",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#b48c3c", marginBottom: "12px" }}>FRAMEWORKS AT WORK</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#f0e8d8", marginBottom: "8px" }}>Goldsmith's Core Premise</div>
                  <div style={{ fontSize: "13px", color: "#9a9080", lineHeight: "1.7" }}>
                    The behaviors that made you successful at your current level are often the same behaviors that will prevent you from reaching the next level. Success creates belief. Belief creates blindspots. This program targets those blindspots — specifically the interpersonal habits that erode executive presence.
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#f0e8d8", marginBottom: "8px" }}>The Gervais Principle Applied</div>
                  <div style={{ fontSize: "13px", color: "#9a9080", lineHeight: "1.7" }}>
                    Venkat Rao's model: organizations are run by Sociopaths (who use the system), managed by Clueless (who believe in it), and staffed by Losers (who trade effort for security). Moving from Clueless to Sociopath tier requires playing a fundamentally different game — strategic, less visible in details, more visible in framing. This program helps you make that transition consciously.
                  </div>
                </div>
              </div>
            </div>

            {/* Week Grid */}
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "16px" }}>8-WEEK OVERVIEW</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
              {WEEKS.map(w => {
                const pct = weekProgress(w.week);
                return (
                  <div key={w.week} onClick={() => { setCurrentWeek(w.week); setActiveView("plan"); }}
                    style={{
                      background: currentWeek === w.week ? "rgba(180,140,60,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${currentWeek === w.week ? "rgba(180,140,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "8px",
                      padding: "16px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ fontSize: "10px", color: "#b48c3c", letterSpacing: "2px" }}>WK {w.week}</div>
                      <div style={{ fontSize: "11px", color: pct === 100 ? "#5a9060" : "#7a7060" }}>{pct}%</div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#f0e8d8", marginBottom: "4px" }}>{w.title}</div>
                    <div style={{ fontSize: "11px", color: "#7a7060", marginBottom: "12px" }}>{w.theme}</div>
                    <div style={{
                      height: "3px", borderRadius: "2px",
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: pct === 100 ? "#5a9060" : "#b48c3c",
                        borderRadius: "2px",
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gervais Tier Map */}
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "16px" }}>GERVAIS TIER MAP — WHERE ARE YOU NOW?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                { tier: "Sociopath", color: "#8060a0", desc: "Plays the long game. Uses systems. Invisible in details, visible in outcomes. Controls information asymmetry.", signal: "Sponsors careers. Makes strategic bets. Rarely defends their choices." },
                { tier: "Clueless", color: "#b48c3c", desc: "Believes in the mission. Works hard. Optimizes the wrong scorecard. Visible in execution.", signal: "Explains their reasoning. Adds value in meetings. Needs to be seen as smart.", current: true },
                { tier: "Loser", color: "#7a7060", desc: "Trades time for security. Disengaged from politics. Preserves optionality by not over-investing.", signal: "Quietly expert. Avoids visibility. Not a management candidate." },
              ].map(t => (
                <div key={t.tier} style={{
                  background: t.current ? `rgba(180,140,60,0.08)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${t.current ? "rgba(180,140,60,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "8px",
                  padding: "20px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color }} />
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#f0e8d8" }}>{t.tier}</div>
                    {t.current && <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#b48c3c", background: "rgba(180,140,60,0.15)", padding: "2px 6px", borderRadius: "3px" }}>YOU → TARGET ↑</div>}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9a9080", lineHeight: "1.6", marginBottom: "8px" }}>{t.desc}</div>
                  <div style={{ fontSize: "11px", color: "#6a6050", fontStyle: "italic", lineHeight: "1.5" }}>"{t.signal}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8-WEEK PLAN */}
        {activeView === "plan" && weekObj && (
          <div>
            {/* Week selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
              {WEEKS.map(w => (
                <button key={w.week} onClick={() => setCurrentWeek(w.week)} style={{
                  padding: "8px 14px",
                  background: currentWeek === w.week ? "rgba(180,140,60,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${currentWeek === w.week ? "rgba(180,140,60,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "6px",
                  color: currentWeek === w.week ? "#b48c3c" : "#7a7060",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>
                  Wk {w.week}: {w.title}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
              <div>
                {/* Week header */}
                <div style={{
                  background: "rgba(180,140,60,0.06)",
                  border: "1px solid rgba(180,140,60,0.2)",
                  borderRadius: "8px",
                  padding: "24px",
                  marginBottom: "20px",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#b48c3c", marginBottom: "8px" }}>WEEK {weekObj.week} OF 8</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#f0e8d8", marginBottom: "4px" }}>{weekObj.title}</div>
                  <div style={{ fontSize: "14px", color: "#9a9080", marginBottom: "16px" }}>{weekObj.theme}</div>
                  <div style={{ fontSize: "13px", color: "#8a8070", lineHeight: "1.8" }}>{weekObj.overview}</div>
                </div>

                {/* Habits targeted */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "12px" }}>HABITS TARGETED THIS WEEK</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {weekObj.habits.map(h => (
                      <div key={h} style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "6px",
                        padding: "12px 16px",
                      }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8060a0", flexShrink: 0 }} />
                        <div style={{ fontSize: "13px", color: "#c8c0b0" }}>{h}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "12px" }}>THIS WEEK'S ACTIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {weekObj.actions.map(a => {
                      const done = (weekData[weekObj.week]?.completed || []).includes(a);
                      return (
                        <div key={a} onClick={() => toggleAction(weekObj.week, a)} style={{
                          display: "flex", alignItems: "flex-start", gap: "14px",
                          background: done ? "rgba(90,144,96,0.08)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${done ? "rgba(90,144,96,0.3)" : "rgba(255,255,255,0.07)"}`,
                          borderRadius: "6px",
                          padding: "14px 16px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}>
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, marginTop: "1px",
                            border: `2px solid ${done ? "#5a9060" : "rgba(180,140,60,0.4)"}`,
                            background: done ? "#5a9060" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {done && <span style={{ color: "white", fontSize: "11px" }}>✓</span>}
                          </div>
                          <div style={{ fontSize: "13px", color: done ? "#7a9080" : "#c8c0b0", lineHeight: "1.6", textDecoration: done ? "line-through" : "none" }}>{a}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gervais insight */}
                <div style={{
                  background: "rgba(128,96,160,0.06)",
                  border: "1px solid rgba(128,96,160,0.2)",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#8060a0", marginBottom: "8px" }}>GERVAIS PRINCIPLE · {weekObj.gervais}</div>
                  <div style={{ fontSize: "13px", color: "#9a8aaa", lineHeight: "1.8" }}>{weekObj.gervaisNote}</div>
                </div>

                {/* Reflection */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "10px" }}>WEEKLY REFLECTION PROMPT</div>
                  <div style={{
                    fontSize: "14px", fontStyle: "italic", color: "#b48c3c",
                    padding: "16px", background: "rgba(180,140,60,0.05)",
                    border: "1px solid rgba(180,140,60,0.15)", borderRadius: "6px",
                    marginBottom: "12px", lineHeight: "1.6",
                  }}>
                    "{weekObj.reflection}"
                  </div>
                  <textarea
                    value={weekData[weekObj.week]?.reflection || ""}
                    onChange={e => setReflection(weekObj.week, e.target.value)}
                    placeholder="Your reflection..."
                    style={{
                      width: "100%", minHeight: "100px", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
                      color: "#c8c0b0", padding: "14px", fontSize: "13px",
                      fontFamily: "inherit", lineHeight: "1.7", resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Right sidebar */}
              <div>
                {/* KPI */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "16px",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "12px" }}>SUCCESS METRICS</div>
                  <div style={{ fontSize: "13px", color: "#9a9080", lineHeight: "1.8" }}>{weekObj.kpi}</div>
                </div>

                {/* Progress */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "16px",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "16px" }}>WEEK {weekObj.week} PROGRESS</div>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "42px", fontWeight: "700", color: "#b48c3c", lineHeight: 1 }}>{weekProgress(weekObj.week)}%</div>
                    <div style={{ fontSize: "11px", color: "#7a7060", marginTop: "4px" }}>
                      {(weekData[weekObj.week]?.completed || []).length} / {weekObj.actions.length} actions
                    </div>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
                    <div style={{
                      height: "100%", width: `${weekProgress(weekObj.week)}%`,
                      background: weekProgress(weekObj.week) === 100 ? "#5a9060" : "#b48c3c",
                      borderRadius: "3px", transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>

                {/* Self-rating */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "12px" }}>SELF-RATING THIS WEEK</div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(weekObj.week, n)} style={{
                        width: "40px", height: "40px", borderRadius: "6px",
                        background: (weekData[weekObj.week]?.rating || 0) >= n ? "rgba(180,140,60,0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${(weekData[weekObj.week]?.rating || 0) >= n ? "rgba(180,140,60,0.5)" : "rgba(255,255,255,0.1)"}`,
                        color: (weekData[weekObj.week]?.rating || 0) >= n ? "#b48c3c" : "#5a5040",
                        cursor: "pointer", fontSize: "16px", fontFamily: "inherit",
                      }}>★</button>
                    ))}
                  </div>
                  <div style={{ textAlign: "center", fontSize: "11px", color: "#5a5040", marginTop: "8px" }}>
                    {["", "Struggled", "Below target", "On track", "Strong week", "Breakthrough"][weekData[weekObj.week]?.rating || 0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HABIT AUDIT */}
        {activeView === "habits" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "8px" }}>GOLDSMITH'S 20 HABITS — SELF AUDIT</div>
              <div style={{ fontSize: "13px", color: "#7a7060", lineHeight: "1.7" }}>
                Rate yourself on each habit: 1 = rarely an issue, 5 = this is me in most meetings. Higher scores = higher priority to address first.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {GOLDSMITH_HABITS.map((h, i) => {
                const rating = habitRatings[h] || 0;
                return (
                  <div key={h} style={{
                    display: "grid", gridTemplateColumns: "28px 1fr auto",
                    alignItems: "center", gap: "16px",
                    background: rating >= 4 ? "rgba(160,80,60,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${rating >= 4 ? "rgba(160,80,60,0.25)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "6px",
                    padding: "14px 18px",
                  }}>
                    <div style={{ fontSize: "11px", color: "#5a5040", fontVariantNumeric: "tabular-nums" }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontSize: "13px", color: rating >= 4 ? "#d8a090" : "#c8c0b0" }}>{h}</div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setHabitRatings(prev => ({ ...prev, [h]: n }))} style={{
                          width: "28px", height: "28px", borderRadius: "4px",
                          background: rating >= n
                            ? rating >= 4 ? "rgba(160,80,60,0.4)" : "rgba(180,140,60,0.3)"
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${rating >= n
                            ? rating >= 4 ? "rgba(160,80,60,0.5)" : "rgba(180,140,60,0.4)"
                            : "rgba(255,255,255,0.08)"}`,
                          color: rating >= n ? rating >= 4 ? "#d8a090" : "#b48c3c" : "#3a3028",
                          cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
                        }}>{n}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {Object.values(habitRatings).some(v => v > 0) && (
              <div style={{
                marginTop: "24px",
                background: "rgba(180,140,60,0.06)",
                border: "1px solid rgba(180,140,60,0.2)",
                borderRadius: "8px",
                padding: "20px",
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#b48c3c", marginBottom: "12px" }}>YOUR TOP PRIORITY HABITS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {Object.entries(habitRatings)
                    .filter(([, v]) => v >= 3)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([h, v]) => (
                      <div key={h} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#c8c0b0" }}>
                        <span>{h}</span>
                        <span style={{ color: v >= 4 ? "#d8a090" : "#b48c3c", fontSize: "12px" }}>{"★".repeat(v)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WEEKLY CHECK-IN */}
        {activeView === "checkin" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "8px" }}>WEEKLY CHECK-IN</div>
              <div style={{ fontSize: "13px", color: "#7a7060" }}>Use this every Friday to assess the week and set intention for the next.</div>
            </div>

            {/* Week selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
              {WEEKS.map(w => (
                <button key={w.week} onClick={() => setCheckinWeek(w.week === checkinWeek ? null : w.week)} style={{
                  padding: "8px 14px",
                  background: checkinWeek === w.week ? "rgba(180,140,60,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${checkinWeek === w.week ? "rgba(180,140,60,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "6px",
                  color: checkinWeek === w.week ? "#b48c3c" : "#7a7060",
                  cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
                }}>
                  Week {w.week}
                </button>
              ))}
            </div>

            {checkinWeek && (() => {
              const w = WEEKS.find(x => x.week === checkinWeek);
              const d = weekData[checkinWeek];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "20px",
                  }}>
                    <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "16px" }}>WEEK {checkinWeek} SUMMARY</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#f0e8d8", marginBottom: "4px" }}>{w.title}</div>
                    <div style={{ fontSize: "12px", color: "#7a7060", marginBottom: "16px" }}>{w.theme}</div>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#7a7060", marginBottom: "8px" }}>
                        <span>Actions completed</span>
                        <span>{(d?.completed || []).length} / {w.actions.length}</span>
                      </div>
                      <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ height: "100%", width: `${weekProgress(checkinWeek)}%`, background: "#b48c3c", borderRadius: "2px" }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px" }}>SELF-RATING</div>
                      <div style={{ fontSize: "24px", color: "#b48c3c" }}>{"★".repeat(d?.rating || 0)}{"☆".repeat(5 - (d?.rating || 0))}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px" }}>KPI TARGET</div>
                      <div style={{ fontSize: "12px", color: "#8a8070", lineHeight: "1.7" }}>{w.kpi}</div>
                    </div>
                  </div>

                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "20px",
                  }}>
                    <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#7a7060", marginBottom: "16px" }}>YOUR REFLECTION</div>
                    {d?.reflection ? (
                      <div style={{ fontSize: "13px", color: "#c8c0b0", lineHeight: "1.8", fontStyle: "italic" }}>"{d.reflection}"</div>
                    ) : (
                      <div style={{ fontSize: "13px", color: "#4a4030", fontStyle: "italic" }}>No reflection recorded yet. Go to the Plan tab to add one.</div>
                    )}
                    <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px" }}>PROMPT REMINDER</div>
                      <div style={{ fontSize: "12px", color: "#7a6050", fontStyle: "italic", lineHeight: "1.7" }}>"{w.reflection}"</div>
                    </div>
                  </div>

                  {/* What's next */}
                  {checkinWeek < 8 && (
                    <div style={{
                      gridColumn: "1 / -1",
                      background: "rgba(180,140,60,0.06)",
                      border: "1px solid rgba(180,140,60,0.2)",
                      borderRadius: "8px", padding: "20px",
                    }}>
                      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#b48c3c", marginBottom: "12px" }}>NEXT UP → WEEK {checkinWeek + 1}</div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#f0e8d8", marginBottom: "8px" }}>
                        {WEEKS[checkinWeek].title}: {WEEKS[checkinWeek].theme}
                      </div>
                      <div style={{ fontSize: "13px", color: "#9a9080", lineHeight: "1.7" }}>{WEEKS[checkinWeek].overview}</div>
                      <button onClick={() => { setCurrentWeek(checkinWeek + 1); setActiveView("plan"); }} style={{
                        marginTop: "16px",
                        padding: "10px 20px",
                        background: "rgba(180,140,60,0.15)",
                        border: "1px solid rgba(180,140,60,0.3)",
                        borderRadius: "6px",
                        color: "#b48c3c", cursor: "pointer", fontSize: "12px",
                        letterSpacing: "1px", fontFamily: "inherit",
                      }}>
                        Open Week {checkinWeek + 1} Plan →
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {!checkinWeek && (
              <div style={{
                textAlign: "center", padding: "60px",
                color: "#5a5040", fontSize: "14px", fontStyle: "italic",
              }}>
                Select a week above to review your check-in
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
