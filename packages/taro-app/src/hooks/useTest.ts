import { useState, useMemo, useCallback } from 'react'
import { questions, specialQuestions } from '../constants/questions'
import { shuffle } from '../utils/shuffle'
import type { Question, SpecialQuestion } from '../types'

export function useTest() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQ, setCurrentQ] = useState(0)

  // Shuffle questions once on mount, insert first special question at random position
  const shuffledQuestions = useMemo(() => {
    const shuffled = shuffle(questions)
    const insertIndex = Math.floor(Math.random() * shuffled.length) + 1
    return [
      ...shuffled.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffled.slice(insertIndex),
    ] as (Question | SpecialQuestion)[]
  }, [])

  // If drink gate q1 answer is 3, insert drink trigger question after it
  const visibleQuestions = useMemo(() => {
    const visible = [...shuffledQuestions]
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
    if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1] as any)
    }
    return visible
  }, [shuffledQuestions, answers])

  const total = visibleQuestions.length
  const done = visibleQuestions.filter(q => answers[q.id] !== undefined).length
  const progress = total ? (done / total) * 100 : 0
  const isComplete = done === total && total > 0
  const currentQuestion = visibleQuestions[currentQ]

  const answer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value }
      if (questionId === 'drink_gate_q1' && value !== 3) {
        delete next['drink_gate_q2']
      }
      return next
    })
    // Auto advance after short delay
    setTimeout(() => {
      setCurrentQ(prev => {
        const maxIndex = visibleQuestions.length - 1
        return Math.min(prev + 1, maxIndex)
      })
    }, 300)
  }, [visibleQuestions.length])

  const prev = useCallback(() => {
    setCurrentQ(q => Math.max(0, q - 1))
  }, [])

  const next = useCallback(() => {
    if (currentQuestion && answers[currentQuestion.id] !== undefined) {
      setCurrentQ(q => Math.min(q + 1, visibleQuestions.length - 1))
    }
  }, [answers, currentQuestion, visibleQuestions.length])

  return {
    currentQ, currentQuestion, visibleQuestions,
    answers, total, done, progress, isComplete,
    answer, prev, next,
  }
}
