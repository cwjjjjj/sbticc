import { createContext, useContext, type ReactNode } from 'react';

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
