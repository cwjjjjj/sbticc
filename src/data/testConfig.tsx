import { createContext, useContext, type ReactNode } from 'react';

export type Gender = 'male' | 'female' | 'unspecified';

export interface DimensionInfo {
  name: string;
  model: string;
}

export interface QuestionOption {
  label: string;
  value: number;
}

export interface Question {
  id: string;
  dim?: string;
  text: string;
  options: QuestionOption[];
  multiSelect?: boolean;
  special?: boolean;
  kind?: string;
}

export interface TypeDef {
  code: string;
  cn: string;
  intro: string;
  desc: string;
}

export interface NormalType {
  code: string;
  pattern: string;
}

export interface RarityInfo {
  pct: number;
  stars: number;
  label: string;
}

export interface CompatEntry {
  type: 'soulmate' | 'rival';
  say: string;
}

export interface CompatResult {
  type: 'soulmate' | 'rival' | 'mirror' | 'normal';
  say: string;
}

export interface TestConfig {
  id: string;
  name: string;

  // Dimensions
  dimensionOrder: string[];
  dimensionMeta: Record<string, DimensionInfo>;
  dimExplanations: Record<string, Record<string, string>>;

  // Questions
  questions: Question[];
  specialQuestions: Question[];
  gateQuestionId: string;
  gateAnswerValue: number;
  hiddenTriggerQuestionId: string;
  hiddenTriggerValue: number;

  // Types
  typeLibrary: Record<string, TypeDef>;
  normalTypes: NormalType[];
  typeRarity: Record<string, RarityInfo>;
  typeImages: Record<string, string>;
  shareImages: Record<string, string>;

  // Compatibility
  compatibility: Record<string, CompatEntry>;
  getCompatibility: (a: string, b: string) => CompatResult;

  // Matching params
  sumToLevel: (score: number) => string;
  /**
   * Optional per-dimension override for sumToLevel. When provided and it
   * returns a non-undefined value for the given dim, matching.ts will use it
   * in place of the flat `sumToLevel`. Used by tests whose dims have varying
   * question counts (e.g. FSI: 2 题 GNDR / 3 题 ECHO / 4 题 others).
   */
  sumToLevelByDim?: (score: number, dim: string) => string | undefined;
  maxDistance: number;
  fallbackTypeCode: string;
  hiddenTypeCode: string;
  similarityThreshold: number;

  // URLs & Storage
  prodBaseUrl: string;
  basePath: string;
  localHistoryKey: string;
  localStatsKey: string;
  apiTestParam: string;

  // Display text
  dimSectionTitle: string;
  questionCountLabel: string;

  // GSTI-only: 性别锁定支持
  genderLocked?: boolean;                  // true → UI 触发性别选择器
  typePoolByGender?: {                      // 按性别过滤匹配的类型池
    male: string[];                         // 男性用户可匹配的类型代号
    female: string[];                       // 女性用户可匹配的类型代号
    both: string[];                         // 选"不透露"时，可匹配的类型代号（通常 = male + female）
  };
}

const TestConfigContext = createContext<TestConfig | null>(null);

export function TestConfigProvider({
  config,
  children,
}: {
  config: TestConfig;
  children: ReactNode;
}) {
  return (
    <TestConfigContext.Provider value={config}>
      {children}
    </TestConfigContext.Provider>
  );
}

export function useTestConfig(): TestConfig {
  const ctx = useContext(TestConfigContext);
  if (!ctx) throw new Error('useTestConfig must be used within TestConfigProvider');
  return ctx;
}
