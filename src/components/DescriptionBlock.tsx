/**
 * DescriptionBlock — renders a personality type's `desc` string
 * into visually structured sections.
 *
 * Handles multiple desc formats:
 *   - Structured (love/work/cyber/desire): headers like 天赋优势：, 隐秘代价：, etc.
 *   - Semi-structured (values): paragraphs + a closing "刺痛" quote
 *   - Unstructured (sbti): plain paragraphs with no headers
 */

const HEADER_PATTERNS = [
  '你是这样的人',
  '天赋优势',
  '你的天赋优势',
  '隐秘代价',
  '你的隐秘代价',
  '致命代价',
  '你的致命代价',
] as const;

const QUOTE_PATTERNS = [
  '一句刺痛你的话',
  '一句刺痛的话',
  '一句话',
] as const;

interface Section {
  kind: 'header-body' | 'quote' | 'plain';
  header?: string;
  body: string;
}

function parseDesc(desc: string): Section[] {
  // Split on double newlines (the universal paragraph separator in the data)
  const paragraphs = desc.split('\n\n').map((p) => p.trim()).filter(Boolean);

  if (paragraphs.length === 0) return [];

  const sections: Section[] = [];

  for (const para of paragraphs) {
    // Check if this paragraph starts with a known quote pattern
    const quoteMatch = QUOTE_PATTERNS.find(
      (p) => para.startsWith(p + '：') || para.startsWith(p + ':'),
    );
    if (quoteMatch) {
      const body = para.slice(para.indexOf('：') !== -1 ? para.indexOf('：') + 1 : para.indexOf(':') + 1).trim();
      sections.push({ kind: 'quote', header: quoteMatch, body });
      continue;
    }

    // Check if this paragraph starts with a known header pattern
    const headerMatch = HEADER_PATTERNS.find(
      (p) => para.startsWith(p + '：') || para.startsWith(p + ':') || para === p,
    );
    if (headerMatch) {
      const colonIdx = para.indexOf('：') !== -1 ? para.indexOf('：') : para.indexOf(':');
      const body = colonIdx !== -1 ? para.slice(colonIdx + 1).trim() : '';
      sections.push({ kind: 'header-body', header: headerMatch, body });
      continue;
    }

    // Check if the paragraph has a header-like prefix (text ending in ： before the body)
    // Only match short prefixes (< 15 chars) to avoid false positives on plain text
    const colonPos = para.indexOf('：');
    if (colonPos > 0 && colonPos < 15) {
      const candidateHeader = para.slice(0, colonPos);
      // Verify it looks like a header: no periods/commas in the header part
      if (!/[，。、！？；]/.test(candidateHeader)) {
        const body = para.slice(colonPos + 1).trim();
        sections.push({ kind: 'header-body', header: candidateHeader, body });
        continue;
      }
    }

    // Plain paragraph
    sections.push({ kind: 'plain', body: para });
  }

  return sections;
}

/**
 * If body text contains Chinese semicolons (；), split into bullet points.
 * Only split if there are at least 2 semicolons (i.e. 3+ items).
 */
function renderBody(body: string) {
  const semicolonCount = (body.match(/；/g) || []).length;

  if (semicolonCount >= 2) {
    // Split on ；and also handle trailing period
    const items = body
      .split('；')
      .map((s) => s.replace(/[。]$/, '').trim())
      .filter(Boolean);

    return (
      <ul className="space-y-1.5 mt-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-[#aaa] leading-relaxed">
            <span className="text-accent/60 mt-0.5 flex-shrink-0">&#8226;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm text-[#aaa] leading-relaxed mt-1.5">{body}</p>;
}

export default function DescriptionBlock({ desc }: { desc: string }) {
  const sections = parseDesc(desc);

  // If parsing produced only plain sections (sbti-style), render simply
  const allPlain = sections.every((s) => s.kind === 'plain');

  if (allPlain) {
    return (
      <div className="space-y-4">
        {sections.map((s, i) => (
          <p key={i} className="text-sm text-[#aaa] leading-relaxed">
            {s.body}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map((section, i) => {
        if (section.kind === 'quote') {
          return (
            <div
              key={i}
              className="text-center py-4 px-5"
            >
              <p className="text-base italic text-accent/90 leading-relaxed font-medium">
                {'\u300C'}{section.body}{'\u300D'}
              </p>
            </div>
          );
        }

        if (section.kind === 'header-body') {
          return (
            <div key={i}>
              <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                <span className="w-[2px] h-3.5 bg-accent/60 rounded-sm flex-shrink-0" />
                {section.header}
              </h4>
              {section.body && renderBody(section.body)}
            </div>
          );
        }

        // plain
        return (
          <p key={i} className="text-sm text-[#aaa] leading-relaxed">
            {section.body}
          </p>
        );
      })}
    </div>
  );
}
