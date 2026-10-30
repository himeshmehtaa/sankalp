import mammoth from 'mammoth';
import { extractTextFromPdf } from './pdfExtractor';
import { extractTextFromPptx } from './pptxExtractor';
import {
  GuidedJourney,
  JourneyDay,
  JourneyDaySection,
  JourneyPhase,
  ProgrammeCategory,
  JourneySectionType,
} from '../types/journeys';

/**
 * Extracts raw text from an uploaded File (.pdf, .docx, .txt, .md, etc.)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  // 1. PDF File extraction
  if (fileExt === 'pdf') {
    return await extractTextFromPdf(file);
  }

  // 2. DOCX Word File extraction
  if (fileExt === 'docx' || fileExt === 'doc') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // 3. PPTX PowerPoint File extraction
  if (fileExt === 'pptx' || fileExt === 'ppt') {
    return await extractTextFromPptx(file);
  }

  // 4. Text, Markdown, or fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve((e.target?.result as string) || '');
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Parses any programme text (from PDF, Word, ChatGPT schedule)
 * into a structured D1, D2, D3... DN journey.
 */
export function parseProgrammeText(
  rawText: string,
  userMetadata?: {
    title?: string;
    mentorName?: string;
    organization?: string;
    category?: ProgrammeCategory;
    startDate?: string;
    fileName?: string;
    personalNotes?: string;
    targetDaysCount?: number; // 7, 14, 21, 30, 60, 90, or auto
    themeColor?: 'terracotta' | 'sage' | 'charcoal' | 'amber' | 'sand';
  }
): GuidedJourney {
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Detect title & mentor
  let detectedTitle = userMetadata?.title?.trim() || '';
  let detectedMentor = userMetadata?.mentorName?.trim() || '';
  let detectedTagline = '';

  if (!detectedTitle) {
    if (cleanText.includes('RESET ENTROPY')) {
      detectedTitle = 'RESET ENTROPY™ 14-Day Transformation Continuation';
      detectedMentor = 'Reset Entropy Coaching';
      detectedTagline = 'Body steadiness → Self-trust → Actual work → Visibility';
    } else {
      // Look for title patterns like "# Title", "Programme: ...", "Schedule: ..."
      const headingLine = lines.find(
        (l) =>
          !l.startsWith('---') &&
          l.length > 3 &&
          l.length < 80 &&
          !/^(day|d\d|phase|week|morning|evening)/i.test(l)
      );
      detectedTitle = headingLine ? headingLine.replace(/^[#\*\s]+/, '').trim() : 'Daily Focus Programme';
      detectedTagline = 'Every day, one step closer.';
    }
  }

  if (!detectedMentor) {
    if (/mentor|coach|trainer|author|by\s+([A-Za-z\s]+)/i.test(cleanText)) {
      const mentorMatch = cleanText.match(/(?:mentor|coach|trainer|by|created by)[:\s]+([A-Za-z0-9\s™]+)/i);
      if (mentorMatch && mentorMatch[1].trim().length < 40) {
        detectedMentor = mentorMatch[1].trim();
      }
    }
    if (!detectedMentor) detectedMentor = 'Personal Schedule';
  }

  // 2. Detect duration (e.g. 30 days, 60 days, 14 days, 90 days)
  let detectedDuration = userMetadata?.targetDaysCount;
  if (!detectedDuration) {
    // Check for explicit mention in text (e.g. "30-day", "60 Day", "21-Day", "90 days", "14-Day")
    const durationMatch = cleanText.match(/\b(7|14|21|28|30|45|60|75|90|100)\s*(?:-|–|\s)?(?:day|days)\b/i);
    if (durationMatch) {
      detectedDuration = parseInt(durationMatch[1], 10);
    }
  }

  // 3. Search for explicit Day blocks in text
  // Supports: "DAY 01", "Day 1", "D1", "D01", "Day 1:", "Day 01 - Theme", "Week 1, Day 1"
  const dayHeaderRegex = /(?:DAY|Day|D|d)\s*([0-9]{1,3})(?:\s*[·•\-:]\s*([A-Za-z]{3}\s+[0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4}))?(?:\s*[·•\-:]\s*([^\n]+))?/gi;

  const foundDayBlocks: {
    dayNum: number;
    dateStr?: string;
    theme?: string;
    startIndex: number;
    matchLen: number;
  }[] = [];

  let dMatch;
  while ((dMatch = dayHeaderRegex.exec(cleanText)) !== null) {
    const num = parseInt(dMatch[1], 10);
    // Sanity check to avoid false matches like "D2" in hex or numbers > 365
    if (num > 0 && num <= 365) {
      foundDayBlocks.push({
        dayNum: num,
        dateStr: dMatch[2]?.trim(),
        theme: dMatch[3]?.trim(),
        startIndex: dMatch.index,
        matchLen: dMatch[0].length,
      });
    }
  }

  // Deduplicate found days by dayNum
  const uniqueExplicitDays = foundDayBlocks.filter(
    (item, index, self) => index === self.findIndex((t) => t.dayNum === item.dayNum)
  );

  uniqueExplicitDays.sort((a, b) => a.dayNum - b.dayNum);

  // Determine final number of days (default to 14 if neither found nor specified)
  const finalDaysCount =
    detectedDuration ||
    (uniqueExplicitDays.length > 0 ? Math.max(...uniqueExplicitDays.map((d) => d.dayNum)) : 14);

  // Base start date
  const baseStartDate = userMetadata?.startDate
    ? new Date(userMetadata.startDate)
    : new Date();

  // 4. Build Phases (e.g. 7-day phases or detected phases)
  const phasesCount = Math.max(1, Math.ceil(finalDaysCount / 7));
  const phases: JourneyPhase[] = [];

  for (let p = 1; p <= phasesCount; p++) {
    const startDay = (p - 1) * 7 + 1;
    const endDay = Math.min(p * 7, finalDaysCount);

    let phaseTitle = `Phase 0${p} — Momentum`;
    if (p === 1) phaseTitle = 'Phase 01 — Foundation & Rhythm';
    else if (p === 2) phaseTitle = 'Phase 02 — Focus & Deep Work';
    else if (p === 3) phaseTitle = 'Phase 03 — Consistency & Proof';
    else if (p === 4) phaseTitle = 'Phase 04 — Mastery & Review';

    phases.push({
      id: `phase-${p}`,
      phaseNumber: p,
      title: phaseTitle,
      subtitle: `D${startDay}–D${endDay}`,
      startDay,
      endDay,
      dateRange: `Days ${startDay}–${endDay}`,
    });
  }

  // 5. Construct Days (D1, D2, D3... DN)
  const generatedDays: JourneyDay[] = [];

  for (let dayNum = 1; dayNum <= finalDaysCount; dayNum++) {
    const dayLabel = `D${dayNum}`;
    const explicitMatch = uniqueExplicitDays.find((d) => d.dayNum === dayNum);

    // Calculate dates
    const dayDate = new Date(baseStartDate);
    dayDate.setDate(baseStartDate.getDate() + (dayNum - 1));

    const dateString =
      explicitMatch?.dateStr ||
      dayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    const isoDate = dayDate.toISOString().split('T')[0];

    // Find content slice for explicit days
    let dayRawContent = '';
    if (explicitMatch) {
      const currentIdx = uniqueExplicitDays.indexOf(explicitMatch);
      const nextExplicit = uniqueExplicitDays[currentIdx + 1];
      const endIdx = nextExplicit ? nextExplicit.startIndex : cleanText.length;
      dayRawContent = cleanText.slice(explicitMatch.startIndex + explicitMatch.matchLen, endIdx).trim();
    }

    // Assign theme
    let dayTheme = explicitMatch?.theme || '';
    if (!dayTheme) {
      if (dayRawContent) {
        const firstLine = dayRawContent.split('\n')[0].replace(/^[-•*#\s]+/, '').trim();
        dayTheme = firstLine.slice(0, 60);
      }
      if (!dayTheme) {
        dayTheme = `Day ${dayNum} Focus & Deliverable`;
      }
    }

    // Determine phase
    const matchingPhase =
      phases.find((p) => dayNum >= p.startDay && dayNum <= p.endDay) || phases[0];

    // Parse internal sections (Morning, Work, Pattern, Evening, Proof)
    const sections: JourneyDaySection[] = [];

    const secKeywords = [
      { key: 'MORNING', type: 'morning' as JourneySectionType, title: 'Morning Ritual & Mindset', badge: '~5 min' },
      { key: 'DO THE WORK', type: 'work' as JourneySectionType, title: 'Main Focus & Deliverable', badge: '25–40 min' },
      { key: 'WORK', type: 'work' as JourneySectionType, title: 'Today’s Work', badge: '30 min' },
      { key: 'WHEN THE PATTERN APPEARS', type: 'pattern' as JourneySectionType, title: 'When Friction Arrives', badge: 'Mindset' },
      { key: 'OBSTACLE', type: 'pattern' as JourneySectionType, title: 'Obstacle Strategy', badge: 'Reset' },
      { key: 'EVENING', type: 'evening' as JourneySectionType, title: 'Evening Reflection', badge: '90 sec' },
      { key: 'PROOF', type: 'proof' as JourneySectionType, title: 'Proof of Completion', badge: 'Output' },
    ];

    const foundSecs: { key: string; index: number; info: (typeof secKeywords)[0] }[] = [];
    secKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.key}\\b`, 'gi');
      let sm;
      if ((sm = regex.exec(dayRawContent)) !== null) {
        foundSecs.push({ key: kw.key, index: sm.index, info: kw });
      }
    });

    foundSecs.sort((a, b) => a.index - b.index);

    if (foundSecs.length > 0) {
      foundSecs.forEach((fs, sIdx) => {
        const nextIdx = sIdx < foundSecs.length - 1 ? foundSecs[sIdx + 1].index : dayRawContent.length;
        const content = dayRawContent.slice(fs.index + fs.key.length, nextIdx).trim();

        // Extract bullet items for checklist
        const bulletLines = content
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.startsWith('-') || l.startsWith('•') || l.startsWith('*') || /^\d+\./.test(l));

        const checklist =
          bulletLines.length > 0
            ? bulletLines.map((bl, bIdx) => ({
                id: `chk-${dayNum}-${sIdx}-${bIdx}`,
                text: bl.replace(/^[-•*\d.]+\s*/, ''),
                completed: false,
                isMinimumDay: fs.info.type === 'morning' || fs.info.type === 'evening',
              }))
            : [
                {
                  id: `chk-${dayNum}-${sIdx}-1`,
                  text: content.slice(0, 100).split('.')[0] || fs.info.title,
                  completed: false,
                  isMinimumDay: true,
                },
              ];

        sections.push({
          id: `sec-${dayNum}-${sIdx}`,
          type: fs.info.type,
          title: fs.info.title,
          durationBadge: fs.info.badge,
          content: content || 'Follow today’s practice.',
          checklist,
        });
      });
    } else {
      // Default adaptable structure for any schedule (e.g. ChatGPT generated or unformatted)
      const contentSnippet = dayRawContent || `Focus on ${dayTheme}. Complete your primary deliverable before organizing.`;

      sections.push({
        id: `sec-${dayNum}-morning`,
        type: 'morning',
        title: 'Morning Grounding',
        durationBadge: '3 min',
        content: 'Take 2 minutes to breathe and anchor. Name one concrete deliverable that will exist today.',
        checklist: [
          { id: `chk-${dayNum}-m1`, text: 'Grounding: Feel your feet, soften shoulders, breathe comfortable breaths', completed: false, isMinimumDay: true },
          { id: `chk-${dayNum}-m2`, text: `First Action: Define today's #1 deliverable`, completed: false, isMinimumDay: true },
        ],
      });

      sections.push({
        id: `sec-${dayNum}-work`,
        type: 'work',
        title: 'Main Focus Execution',
        durationBadge: '25–40 min',
        content: contentSnippet,
        checklist: [
          { id: `chk-${dayNum}-w1`, text: `Complete deliverable for ${dayLabel}: ${dayTheme}`, completed: false, isMinimumDay: false },
        ],
      });

      sections.push({
        id: `sec-${dayNum}-evening`,
        type: 'evening',
        title: 'Evening Reflection & Proof',
        durationBadge: '90 sec',
        content: 'Review today’s evidence over mood. Write your one-line completed output and prepare tomorrow’s first step.',
        checklist: [
          { id: `chk-${dayNum}-e1`, text: 'Log one line: finished ___ / when friction appeared I ___ / first step tomorrow ___', completed: false, isMinimumDay: true },
        ],
      });
    }

    // Determine initial status: D1 is today, subsequent are upcoming
    let status: 'today' | 'upcoming' = dayNum === 1 ? 'today' : 'upcoming';

    generatedDays.push({
      id: `day-${dayNum}`,
      dayNumber: dayNum,
      dayLabel,
      dateString,
      isoDate,
      theme: dayTheme,
      phaseId: matchingPhase.id,
      status,
      sourceSectionReference: `${dayLabel} > ${dayTheme}`,
      sections,
    });
  }

  // Extract rules if present
  let importantRule = '';
  if (cleanText.includes('OUTPUT BEFORE ORGANIZATION')) {
    importantRule =
      'OUTPUT BEFORE ORGANIZATION: Notion is allowed, planning is allowed, research is allowed. They are not substitutes for creating, finishing, sending or showing something real.';
  } else {
    importantRule = 'EXECUTION FIRST: Focus on completing the day’s primary deliverable before organizing systems.';
  }

  const startDateStr = generatedDays[0]?.isoDate || new Date().toISOString().split('T')[0];
  const endDateStr = generatedDays[generatedDays.length - 1]?.isoDate || new Date().toISOString().split('T')[0];

  return {
    id: `journey-${Date.now()}`,
    title: detectedTitle,
    tagline: detectedTagline || 'Every day, one step closer.',
    mentorName: detectedMentor,
    organization: userMetadata?.organization,
    category: userMetadata?.category || 'transformation',
    themeColor: userMetadata?.themeColor || 'terracotta',
    durationDays: finalDaysCount,
    startDate: startDateStr,
    endDate: endDateStr,
    status: 'active',
    sourceFileName: userMetadata?.fileName || 'Uploaded Programme.pdf',
    sourceRawText: rawText,
    summary: rawText.slice(0, 300).replace(/\n+/g, ' ').trim(),
    importantRule,
    continuationRule:
      'THIS IS NOT A RESTART: Keep all progress from previous weeks. Never catch up by doubling tomorrow’s work.',
    minimumDayRule:
      'MINIMUM DAY: feet on floor (1m) → 10-minute real task → 1-line note (30s). Never double tomorrow’s workload.',
    safetyNotes:
      'Pace yourself steadily. Breathing should be gentle and comfortable. Do not force practices.',
    phases,
    days: generatedDays,
    currentDayNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
