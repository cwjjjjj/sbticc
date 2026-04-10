import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTest } from '../../hooks/useTest'
import { computeResult } from '../../utils/compute'
import { saveResult } from '../../utils/storage'
import { request } from '../../utils/request'

export default function TestPage() {
  const {
    currentQ, currentQuestion, answers,
    total, done, progress, isComplete,
    answer, prev, next,
  } = useTest()

  if (!currentQuestion) return null

  const optionCodes = ['A', 'B', 'C', 'D']

  const handleSubmit = async () => {
    const result = computeResult(answers)
    const typeCode = result.finalType.code

    saveResult(typeCode)
    try {
      await request({ url: '/api/record', method: 'POST', data: { type: typeCode } })
    } catch (e) {}

    // Store answers for result page to read
    Taro.setStorageSync('sbti_current_answers', answers)
    Taro.navigateTo({ url: '/pages/result/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 py-4">
      {/* Progress bar */}
      <View className="bg-[#e8e3d8] rounded-full h-2 mb-2">
        <View
          className="bg-primary h-2 rounded-full"
          style={{ width: `${progress}%`, transition: 'width 0.3s' }}
        />
      </View>
      <Text className="text-xs text-[#6a786f] text-center block mb-4">{done} / {total}</Text>

      {/* Question card */}
      <View className="bg-bg-card rounded-xl p-5 border border-[#e8e3d8]">
        <View className="mb-3">
          <Text className="text-xs bg-primary text-white px-2 py-1 rounded">
            第 {currentQ + 1} / {total} 题
          </Text>
        </View>
        <Text className="text-base text-primary leading-relaxed block mb-4">
          {currentQuestion.text}
        </Text>
        <View>
          {currentQuestion.options.map((opt, i) => {
            const selected = answers[currentQuestion.id] === opt.value
            return (
              <View
                key={i}
                className={`flex items-center p-3 rounded-lg border mb-2 ${
                  selected
                    ? 'bg-primary border-primary'
                    : 'bg-white border-[#e8e3d8]'
                }`}
                onClick={() => answer(currentQuestion.id, opt.value)}
              >
                <View
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                    selected ? 'bg-white text-primary' : 'bg-[#f5f0e8] text-primary-light'
                  }`}
                >
                  <Text>{optionCodes[i]}</Text>
                </View>
                <Text className={`text-sm flex-1 ${selected ? 'text-white' : 'text-primary'}`}>
                  {opt.label}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* Navigation buttons */}
      <View className="flex justify-between mt-4">
        <View
          className={`px-4 py-2 rounded-lg text-sm ${currentQ > 0 ? 'bg-[#e8e3d8] text-primary' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
          onClick={currentQ > 0 ? prev : undefined}
        >
          <Text>上一题</Text>
        </View>
        {currentQ < total - 1 ? (
          <View
            className={`px-4 py-2 rounded-lg text-sm ${answers[currentQuestion.id] !== undefined ? 'bg-primary text-white' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
            onClick={answers[currentQuestion.id] !== undefined ? next : undefined}
          >
            <Text>下一题</Text>
          </View>
        ) : (
          <View
            className={`px-6 py-2 rounded-lg text-sm font-medium ${isComplete ? 'bg-primary text-white' : 'bg-[#f0ede6] text-[#c0bbb0]'}`}
            onClick={isComplete ? handleSubmit : undefined}
          >
            <Text>查看结果</Text>
          </View>
        )}
      </View>

      {/* Hint */}
      <Text className="text-xs text-[#6a786f] text-center block mt-4">
        {isComplete ? '都做完了。现在可以把你的电子魂魄交给结果页审判。' : '全选完才会放行。'}
      </Text>
    </View>
  )
}
