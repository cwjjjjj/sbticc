import { useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { computeResult } from '../../utils/compute'
import { dimensionOrder, dimensionMeta, DIM_EXPLANATIONS } from '../../constants/dimensions'
import { TYPE_IMAGES, TYPE_LIBRARY } from '../../constants/personalities'
import { COMPATIBILITY } from '../../constants/compatibility'

export default function ResultPage() {
  const result = useMemo(() => {
    const answers = Taro.getStorageSync('sbti_current_answers') || {}
    return computeResult(answers)
  }, [])

  const type = result.finalType

  useShareAppMessage(() => ({
    title: `我是${type.code}（${type.cn}），来测测你是什么人格！`,
    path: '/pages/home/index',
  }))

  const imgSrc = TYPE_IMAGES[type.code]

  // Find compatibility matches
  const soulmates: Array<{ code: string; say: string }> = []
  const rivals: Array<{ code: string; say: string }> = []
  Object.keys(COMPATIBILITY).forEach(key => {
    const parts = key.split('+')
    const c = COMPATIBILITY[key]
    if (parts[0] === type.code || parts[1] === type.code) {
      const other = parts[0] === type.code ? parts[1] : parts[0]
      if (c.type === 'soulmate') soulmates.push({ code: other, say: c.say })
      if (c.type === 'rival') rivals.push({ code: other, say: c.say })
    }
  })

  const handleRestart = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  const handleHome = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      {/* Main result card */}
      <View className="bg-bg-card rounded-xl p-6 border border-[#e8e3d8] text-center">
        <Text className="text-xs text-accent block mb-1">{result.modeKicker}</Text>
        {imgSrc && (
          <Image src={imgSrc} className="w-32 h-32 mx-auto my-3 rounded-xl" mode="aspectFill" />
        )}
        <Text className="text-2xl font-bold text-primary block mb-2">
          {type.code}（{type.cn}）
        </Text>
        <View className="bg-[#f5f0e8] px-3 py-1 rounded-full inline-block mb-3">
          <Text className="text-xs text-primary-light">{result.badge}</Text>
        </View>
        <Text className="text-sm text-[#6a786f] block mb-3">{result.sub}</Text>
        <Text className="text-sm text-primary leading-relaxed block text-left">{type.desc}</Text>
      </View>

      {/* 15 Dimension analysis */}
      <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">维度分析</Text>
        {dimensionOrder.map((dim, i) => {
          const level = result.levels[dim]
          const explanation = DIM_EXPLANATIONS[dim]?.[level] || ''
          return (
            <View key={dim} className={`mb-3 pb-3 ${i < dimensionOrder.length - 1 ? 'border-b border-[#f0ede6]' : ''}`}>
              <View className="flex justify-between mb-1">
                <Text className="text-sm font-medium text-primary">{dimensionMeta[dim].name}</Text>
                <Text className="text-xs text-accent">{level} / {result.rawScores[dim]}分</Text>
              </View>
              <Text className="text-xs text-[#6a786f]">{explanation}</Text>
            </View>
          )
        })}
      </View>

      {/* Compatibility results */}
      {(soulmates.length > 0 || rivals.length > 0) && (
        <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
          <Text className="text-lg font-bold text-primary block mb-3">你的人格相性</Text>
          {soulmates.map(s => (
            <View key={s.code} className="mb-2 p-2 bg-[#fce4ec] rounded-lg">
              <Text className="text-sm">💕 {s.code}（{TYPE_LIBRARY[s.code]?.cn}）— {s.say}</Text>
            </View>
          ))}
          {rivals.map(r => (
            <View key={r.code} className="mb-2 p-2 bg-[#fff8e1] rounded-lg">
              <Text className="text-sm">⚔️ {r.code}（{TYPE_LIBRARY[r.code]?.cn}）— {r.say}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Disclaimer */}
      <Text className="text-xs text-[#a09a8f] text-center block mt-4 mb-4">
        {result.special
          ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿当真。'
          : '本测试仅供娱乐，别拿它当诊断、面试、相亲或人生判决书。'}
      </Text>

      {/* Action buttons */}
      <View className="flex gap-3 mt-2">
        <View
          className="flex-1 bg-[#e8e3d8] text-center py-3 rounded-lg"
          onClick={handleHome}
        >
          <Text className="text-sm text-primary">回到首页</Text>
        </View>
        {process.env.TARO_ENV === 'weapp' ? (
          <View className="flex-1 bg-accent text-center py-3 rounded-lg">
            <Text className="text-sm text-white">分享给好友</Text>
          </View>
        ) : (
          <View
            className="flex-1 bg-accent text-center py-3 rounded-lg"
            onClick={() => {
              const url = window.location.href.split('?')[0].split('#')[0]
              if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                  Taro.showToast({ title: '链接已复制', icon: 'success' })
                })
              }
            }}
          >
            <Text className="text-sm text-white">复制链接</Text>
          </View>
        )}
        <View
          className="flex-1 bg-primary text-center py-3 rounded-lg"
          onClick={handleRestart}
        >
          <Text className="text-sm text-white">再测一次</Text>
        </View>
      </View>
    </View>
  )
}
