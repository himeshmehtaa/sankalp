import mammoth from 'mammoth';
import {
  GuidedJourney,
  JourneyDay,
  JourneyDaySection,
  JourneyPhase,
  ProgrammeCategory,
  JourneySectionType,
} from '../types/journeys';

/**
 * Extracts raw text from an uploaded File (.docx, .txt, .md, etc.)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // Text, markdown, or fallback
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
 * Parses raw text into a structured GuidedJourney object
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
  }
): GuidedJourney {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Detect title & mentor
  let detectedTitle = userMetadata?.title || '';
  let detectedMentor = userMetadata?.mentorName || '';
  let detectedTagline = '';

  if (!detectedTitle) {
    if (rawText.includes('RESET ENTROPY')) {
      detectedTitle = 'RESET ENTROPY™ 14-Day Transformation Continuation';
      detectedMentor = 'Reset Entropy Coaching';
      detectedTagline = 'Body steadiness → Self-trust → Actual work → Visibility';
    } else {
      // Find first non-empty heading-like line
      const firstLine = lines[0] || 'My Guided Journey';
      detectedTitle = firstLine.slice(0, 80);
      if (lines.length > 1) {
        detectedTagline = lines[1].slice(0, 100);
      }
    }
  }

  // 2. Parse phases (e.g. PHASE 1 | ... or Week 1: ...)
  const phaseRegex = /(PHASE\s+(\d\d?)|Week\s+(\d\d?))\s*[|•·:\-]\s*([^\n]+)/gi;
  const phases: JourneyPhase[] = [];
  let phaseMatch;
  while ((phaseMatch = phaseRegex.exec(rawText)) !== null) {
    const pNum = parseInt(phaseMatch[2] || phaseMatch[3] || '1', 10);
    const pTitle = phaseMatch[4].trim();
    phases.push({
      id: `phase-${pNum}`,
      phaseNumber: pNum,
      title: pTitle,
      startDay: (pNum - 1) * 7 + 1,
      endDay: pNum * 7,
      dateRange: `Phase ${pNum}`,
    });
  }

  // If no phases were found, provide a single foundation phase
  if (phases.length === 0) {
    phases.push({
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Foundation & Daily Practice',
      subtitle: 'Consistent Daily Action',
      startDay: 1,
      endDay: 14,
      dateRange: 'Day 1 to Final Day',
    });
  }

  // 3. Parse days
  // Supports patterns like:
  // "DAY 01 · Thu 29 Oct 2026 · Theme"
  // "Day 1: Theme"
  // "DAY 1 - Theme"
  const dayHeaderRegex = /(?:DAY|Day)\s+(\d\d?)(?:\s*[·•\-:]\s*([A-Za-z]{3}\s+\d\d?\s+[A-Za-z]{3}\s+\d{4}))?(?:\s*[·•\-:]\s*([^\n]+))?/gi;

  const dayMatches: {
    dayNum: number;
    dateStr?: string;
    theme?: string;
    startIndex: number;
    matchLen: number;
  }[] = [];

  let dMatch;
  while ((dMatch = dayHeaderRegex.exec(rawText)) !== null) {
    const dayNum = parseInt(dMatch[1], 10);
    // Ignore false matches like "Day 1 to Final Day" or repeated mentions
    if (dayNum > 0 && dayNum <= 100) {
      dayMatches.push({
        dayNum,
        dateStr: dMatch[2]?.trim(),
        theme: dMatch[3]?.trim(),
        startIndex: dMatch.index,
        matchLen: dMatch[0].length,
      });
    }
  }

  // Deduplicate day numbers if any
  const uniqueDays = dayMatches.filter(
    (item, index, self) => index === self.findIndex((t) => t.dayNum === item.dayNum)
  );

  const days: JourneyDay[] = [];
  const baseStartDate = userMetadata?.startDate ? new Date(userMetadata.startDate) : new Date();

  uniqueDays.forEach((dm, idx) => {
    const nextStart = idx < uniqueDays.length - 1 ? uniqueDays[idx + 1].startIndex : rawText.length;
    const dayText = rawText.slice(dm.startIndex + dm.matchLen, nextStart).trim();

    // Calculate dates
    let dateString = dm.dateStr;
    let isoDate: string;

    if (dateString) {
      // Try to parse existing date string like "Thu 29 Oct 2026"
      try {
        const d = new Date(dateString);
        isoDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
      } catch {
        isoDate = '';
      }
    } else {
      const dayDate = new Date(baseStartDate);
      dayDate.setDate(baseStartDate.getDate() + (dm.dayNum - 1));
      dateString = dayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      isoDate = dayDate.toISOString().split('T')[0];
    }

    // Assign phase
    const matchingPhase =
      phases.find((p) => dm.dayNum >= p.startDay && dm.dayNum <= p.endDay) || phases[0];

    // Parse sections inside the day (Morning, Work, Pattern/Obstacle, Evening, Proof, etc.)
    const sections: JourneyDaySection[] = [];
    const secKeywords = [
      { key: 'MORNING', type: 'morning' as JourneySectionType, title: 'Morning Sequence', subtitle: 'Body → Belief → First Action', badge: '~4 min' },
      { key: 'DO THE WORK', type: 'work' as JourneySectionType, title: 'Do The Work (Output First)', subtitle: 'Focused Deliverable Block', badge: '25–40 min' },
      { key: 'WORK', type: 'work' as JourneySectionType, title: 'Today’s Work', subtitle: 'Focused Execution', badge: '30 min' },
      { key: 'WHEN THE PATTERN APPEARS', type: 'pattern' as JourneySectionType, title: 'When The Pattern Appears', subtitle: 'Pause, Ground & Move Forward', badge: '60–90 sec' },
      { key: 'OBSTACLE', type: 'pattern' as JourneySectionType, title: 'Obstacle Strategy', subtitle: 'Managing Resistance', badge: 'Mindset' },
      { key: 'EVENING', type: 'evening' as JourneySectionType, title: 'Evening Reflection', subtitle: 'Evidence Over Mood', badge: '90 sec' },
      { key: 'PROOF', type: 'proof' as JourneySectionType, title: 'Proof Deliverable', subtitle: 'Concrete Output', badge: 'Deliverable' },
    ];

    // Find occurrences of keywords in dayText
    const foundKeywords: { key: string; index: number; info: (typeof secKeywords)[0] }[] = [];
    secKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.key}\\b`, 'gi');
      let m;
      if ((m = regex.exec(dayText)) !== null) {
        foundKeywords.push({ key: kw.key, index: m.index, info: kw });
      }
    });

    foundKeywords.sort((a, b) => a.index - b.index);

    if (foundKeywords.length > 0) {
      foundKeywords.forEach((fk, sIdx) => {
        const nextIdx = sIdx < foundKeywords.length - 1 ? foundKeywords[sIdx + 1].index : dayText.length;
        const sectionContent = dayText.slice(fk.index + fk.key.length, nextIdx).trim();

        sections.push({
          id: `day-${dm.dayNum}-${fk.info.type}-${sIdx}`,
          type: fk.info.type,
          title: fk.info.title,
          subtitle: fk.info.subtitle,
          durationBadge: fk.info.badge,
          content: sectionContent,
          checklist: [
            {
              id: `chk-${dm.dayNum}-${sIdx}-1`,
              text: sectionContent.split('.')[0] || fk.info.title,
              completed: false,
              isMinimumDay: fk.info.type === 'morning' || fk.info.type === 'evening',
            },
          ],
        });
      });
    } else {
      // General single section
      sections.push({
        id: `day-${dm.dayNum}-general`,
        type: 'general',
        title: 'Today’s Programme & Instructions',
        subtitle: 'Source Instructions',
        content: dayText || 'Follow today’s instructions from your mentor.',
        checklist: [
          {
            id: `chk-${dm.dayNum}-1`,
            text: dm.theme || `Complete Day ${dm.dayNum} practice`,
            completed: false,
            isMinimumDay: true,
          },
        ],
      });
    }

    // Extract proof prompt if available
    const proofSec = sections.find((s) => s.type === 'proof');

    days.push({
      id: `day-${dm.dayNum}`,
      dayNumber: dm.dayNum,
      dateString: dateString || `Day ${dm.dayNum}`,
      isoDate,
      theme: dm.theme || `Day ${dm.dayNum} Focus`,
      phaseId: matchingPhase.id,
      status: dm.dayNum === 1 ? 'today' : 'upcoming',
      proofPrompt: proofSec?.content,
      sourceSectionReference: `DAY ${String(dm.dayNum).padStart(2, '0')}`,
      sections,
    });
  });

  // Extract rules if present
  let importantRule = '';
  if (rawText.includes('OUTPUT BEFORE ORGANIZATION')) {
    importantRule =
      'OUTPUT BEFORE ORGANIZATION: Notion is allowed, planning is allowed, research is allowed. They are not substitutes for creating, finishing, sending or showing something real.';
  }

  let continuationRule = '';
  if (rawText.includes('THIS IS NOT A RESTART')) {
    continuationRule =
      'THIS IS NOT A RESTART: Keep all progress from your earlier weeks. Never catch up by doubling work.';
  }

  const durationDays = days.length > 0 ? days.length : 14;
  const startDateStr = days[0]?.isoDate || new Date().toISOString().split('T')[0];
  const endDateStr = days[days.length - 1]?.isoDate || new Date().toISOString().split('T')[0];

  return {
    id: `journey-${Date.now()}`,
    title: detectedTitle,
    tagline: detectedTagline || 'Every day, one step closer.',
    mentorName: detectedMentor || 'Mentor / Coach',
    organization: userMetadata?.organization,
    category: userMetadata?.category || 'transformation',
    durationDays,
    startDate: startDateStr,
    endDate: endDateStr,
    status: 'active',
    sourceFileName: userMetadata?.fileName || 'Uploaded Programme.docx',
    sourceRawText: rawText,
    summary: rawText.slice(0, 300).replace(/\n+/g, ' ').trim(),
    importantRule,
    continuationRule,
    minimumDayRule:
      'MINIMUM DAY: feet on floor (1m) → 10-minute real task → 1-line note (30s). Never double tomorrow’s workload.',
    safetyNotes:
      'Breathing should be gentle and comfortable. Do not force practices. If persistent anxiety occurs, seek qualified support.',
    phases,
    days,
    currentDayNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
