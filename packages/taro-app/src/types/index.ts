export interface DimensionMeta {
  name: string
  model: string
}

export interface Question {
  id: string
  dim: string
  text: string
  options: { label: string; value: number }[]
}

export interface SpecialQuestion {
  id: string
  special: true
  kind: string
  text: string
  options: { label: string; value: number }[]
}

export interface PersonalityType {
  code: string
  cn: string
  intro: string
  desc: string
}

export interface NormalType {
  code: string
  pattern: string
}

export interface RarityInfo {
  pct: number
  stars: number
  label: string
}

export interface CompatInfo {
  type: 'soulmate' | 'rival'
  say: string
}

export type DimensionLevel = 'L' | 'M' | 'H'

export interface RankedType extends NormalType, PersonalityType {
  distance: number
  exact: number
  similarity: number
}

export interface TestResult {
  rawScores: Record<string, number>
  levels: Record<string, DimensionLevel>
  ranked: RankedType[]
  bestNormal: RankedType
  finalType: PersonalityType & { similarity?: number }
  modeKicker: string
  badge: string
  sub: string
  special: boolean
  secondaryType: RankedType | null
}
