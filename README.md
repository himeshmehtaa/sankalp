# SANKALP — Premium Personal Life Operating System

> **"A promise to the person you're becoming."**

**SANKALP** is a premium, minimal, beautifully crafted personal life-management operating system that unites long-term ambitions with daily actions, self-reflection, vitality, relationships, finances, and continuous personal growth.

```
Self-awareness → Intention → Action → Reflection → Growth
```

---

## ✦ Core Philosophy & Design Identity

- **Visual Style**: Editorial minimalism with subtle Indian-inspired warmth.
- **Palette**: Warm ivory (`#FAF8F5`), deep charcoal (`#1C1917`), restrained saffron/terracotta (`#C85A17`), and muted amber (`#D97706`).
- **Typography**: Clean, refined typographic hierarchy with generous whitespace, subtle low-contrast borders (`#E8E2D8`), and line iconography via Lucide.
- **Guiding Principle**: *"I can move without complete certainty."*

---

## ✦ Feature Highlights

### 1. Today's Dashboard
- **Personal Direction Reminder**: Your overarching life vision anchored at the top of your day.
- **Today's #1 Proof Action**: A singular daily anchor linked directly to an active 90-day goal.
- **Supporting Priorities**: Up to two secondary focused blocks, keeping daily load intentional.
- **Daily Rhythm & Routines**: Morning Reset, Deep Focus Block, Movement & Vitality, and Evening Shutdown.
- **End-of-Day Reflection**: Guided questions (*What did I complete? What did I learn? What challenged me? What am I grateful for? What is tomorrow's #1 action?*).

### 2. Goals & Life Planning
- **Flexible Hierarchy**: Life Vision → 3–5 Year Horizons → Annual Objectives → 90-Day Focus → Key Milestones → Daily Actions.
- **Life Domains**: Career & Work, Health & Vitality, Finances, Personal Growth, Creativity, Relationships, and Lifestyle.
- **Visual Goal Map**: Interactive cascading map demonstrating how high-level visions translate into today's execution.
- **Milestones Checklist**: Real progress based on completed milestones, avoiding fabricated percentages.

### 3. Tasks & Execution Sanctuary
- **Intentional Buckets**: `Today`, `Inbox`, `Upcoming`, `Someday / Later`, and `Completed`.
- **Conscious Rescheduling**: Move tasks to `Someday` or drop them cleanly without guilt or overwhelming backlogs.
- **Deep Focus Sanctuary**:
  - Configurable focus timer (25m Pomodoro, 50m Flow, 10m Micro-Start).
  - Distraction Parker to offload fleeting thoughts without breaking flow.
  - End-of-session tangible output log measuring real progress.

### 4. Get Me Unstuck (Signature Feature)
A dedicated, compassionate intervention to break procrastination, overthinking, and emotional friction.
- **State Selection**: Scrolling instead of working, overthinking next step, fear of imperfection, task overwhelm, avoiding hard conversation, defensive/frustrated, lost momentum after a missed day.
- **4-Step Intervention**:
  1. *Acknowledge* without judgment.
  2. *Identify* the immediate psychological obstacle.
  3. *Recommend* one specific, physical next action.
  4. *Micro-start*: 2-minute or 10-minute instant Focus launch.
  5. *Log & Learn*: Records what helped you reclaim momentum.

### 5. Journal & Personal Knowledge
- Daily journal with free-form entries, mood & energy tags (`⚡1-5`), and tag filtering.
- Thoughtful inquiry prompts to unlock deeper reflection.
- Two-column reading and writing interface with local autosave.

### 6. Gratitude & Peaceful Reflection
- Three daily gratitudes.
- One thing you appreciate about yourself.
- Daily wins and lessons learned.
- Zero guilt-based streaks—progress is a continuum.

### 7. Habits & Rhythms
- Configurable habits across all life domains.
- 7-day completion tracking.
- Non-punitive recovery: a missed day is just a data point, never a reset.

### 8. Health & Vitality
- Private, non-medical wellness logs:
  - Movement duration and type (Zone 2, strength, mobility).
  - Sleep duration and quality (restful, average, restless).
  - Hydration counter (glasses of water).
  - Energy and mood levels.

### 9. Career & Professional Mastery
- **Skills Roadmap**: 4-level mastery progression (*Learning → Practicing → Proficient → Mastering*).
- **Portfolio & Case Studies**: Project stages (*Concept → Drafting → Refining → Shipped*).
- **Opportunity Pipeline**: Kanban tracker (*Saved → Applied → Interview → Offer*).

### 10. Finances & Life Administration
- **Freedom Runway**: Savings funds with visual progress and balance adjustment.
- **Upcoming Payments**: Fixed monthly bills and annual renewals with "Mark Paid" toggle.
- **Life Admin Commitments**: Family, documents, medical, travel, and home deadlines.

### 11. Life Library & Wisdom Vault
- Searchable collection of guiding principles, book insights, vision board items, future ideas, and memories.
- Summarized key takeaways and domain linkages.

### 12. AI Life Coach
- Context-aware coaching grounded in your recorded life vision and focus logs.
- Helps pick today's proof action, break large goals into 3 steps, or plan around limited time.
- **Strict safety & transparency**: Every AI-generated task or change requires your explicit confirmation before being saved.

### 13. Insights & Weekly Sabbath
- Aggregates actual recorded focus minutes, completed priorities, and goal velocities.
- Guided 5-question weekly review sabbath.

### 14. Settings, Privacy & Data Sovereignty
- **100% Local-First**: All data is stored in the user's browser localStorage.
- **Complete Backup**: Full JSON export and restore at any time.
- **Customizable**: User name, visual density mode (*Comfortable* vs *Compact*), and sample data reset.

---

## ✦ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` / `Ctrl+K` | Open Command Palette & Global Search |
| `U` | Launch **Get Me Unstuck** Intervention |
| `C` | Launch **Quick Capture** Modal |
| `Esc` | Dismiss active modal / drawer |

---

## ✦ Technical Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4 with custom warm editorial theme
- **Icons**: Lucide React
- **Micro-Delight**: Canvas Confetti
- **Storage**: Local-First with JSON Import/Export backup

---

## ✦ Getting Started

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
