import { dimensionMeta, dimensionOrder } from '../constants/dimensions'
import { questions, DRUNK_TRIGGER_QUESTION_ID } from '../constants/questions'
import { TYPE_LIBRARY, NORMAL_TYPES } from '../constants/personalities'
import type { DimensionLevel, TestResult, RankedType } from '../types'

function sumToLevel(score: number): DimensionLevel {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

function levelNum(level: DimensionLevel | string): number {
  return ({ L: 1, M: 2, H: 3 } as Record<string, number>)[level] ?? 1
}

function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('')
}

export function computeResult(answers: Record<string, number>): TestResult {
  // Step 1: Calculate raw scores per dimension
  const rawScores: Record<string, number> = {}
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0 })

  questions.forEach(q => {
    rawScores[q.dim] += Number(answers[q.id] || 0)
  })

  // Step 2: Convert raw scores to levels (L/M/H)
  const levels: Record<string, DimensionLevel> = {}
  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score)
  })

  // Step 3 & 4: Build user vector and compare against all NORMAL_TYPES
  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]))

  const ranked: RankedType[] = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum)
    let distance = 0
    let exact = 0
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i])
      distance += diff
      if (diff === 0) exact += 1
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100))
    return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity }
  }).sort((a, b) => {
    // Step 6: Sort by distance (asc), then exact matches (desc), then similarity (desc)
    if (a.distance !== b.distance) return a.distance - b.distance
    if (b.exact !== a.exact) return b.exact - a.exact
    return b.similarity - a.similarity
  })

  const bestNormal = ranked[0]

  // Step 7: Handle special cases
  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2

  let finalType: TestResult['finalType']
  let modeKicker = '你的主类型'
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
  let special = false
  let secondaryType: RankedType | null = null

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK
    secondaryType = bestNormal
    modeKicker = '隐藏人格已激活'
    badge = '匹配度 100% · 酒精异常因子已接管'
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。'
    special = true
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH
    modeKicker = '系统强制兜底'
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。'
    special = true
  } else {
    finalType = bestNormal
  }

  // Step 8: Return full result object
  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
  }
}
