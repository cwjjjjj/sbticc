// Extended 8-section content for 16 main types + A/T flavor text.
// Consumed only by MbtiResultPage.

export interface MbtiTypeContent {
  overview: string;      // 核心特征
  strengths: string[];   // 优势 bullets
  weaknesses: string[];  // 劣势 bullets
  relationships: string; // 恋爱与人际
  careers: string[];     // 职业建议 bullets
  growth: string;        // 成长建议
  famous: { name: string; role: string }[]; // 著名人物
}

export const MBTI_CONTENT: Record<string, MbtiTypeContent> = {};

export const AT_FLAVOR: Record<'A' | 'T', string> = {
  A: '',
  T: '',
};
