import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { request } from '../../utils/request'
import { getLocalHistory, getLocalStats } from '../../utils/storage'
import { TYPE_LIBRARY } from '../../constants/personalities'
import { TYPE_RARITY } from '../../constants/rarity'

interface RankItem { code: string; count: number }
interface RankData { total: number; list: RankItem[] }

export default function RankingPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RankData | null>(null)

  useEffect(() => {
    request<RankData>({ url: '/api/ranking' })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const history = getLocalHistory()
  const stats = getLocalStats()
  const recentHistory = [...history].reverse().slice(0, 20)

  const handleGoTest = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      {/* Global ranking */}
      <View className="bg-bg-card rounded-xl p-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">全站排行</Text>
        {loading ? (
          <Text className="text-sm text-[#6a786f] text-center block py-8">加载中...</Text>
        ) : !data || data.list.length === 0 ? (
          <Text className="text-sm text-[#6a786f] text-center block py-8">暂无数据</Text>
        ) : (
          <>
            <View className="flex justify-between mb-3">
              <Text className="text-xs text-[#6a786f]">共 {data.total} 人参与</Text>
              <Text className="text-xs text-[#6a786f]">覆盖 {data.list.length} 种人格</Text>
            </View>
            {data.list.map((item, i) => {
              const lib = TYPE_LIBRARY[item.code]
              const maxCount = data.list[0].count
              const pct = Math.round((item.count / maxCount) * 100)
              return (
                <View key={item.code} className="flex items-center mb-2">
                  <Text className="w-6 text-sm text-[#6a786f] text-center">{i + 1}</Text>
                  <View className="flex-1 ml-2">
                    <View className="flex items-center gap-1 mb-1">
                      <Text className="text-sm font-medium text-primary">{item.code}</Text>
                      <Text className="text-xs text-primary-light">{lib?.cn}</Text>
                    </View>
                    <View className="bg-[#f0ede6] rounded-full h-1.5">
                      <View className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </View>
                  </View>
                  <Text className="ml-2 text-xs text-[#6a786f]">{item.count} 次</Text>
                </View>
              )
            })}
          </>
        )}
      </View>

      {/* Local history */}
      <View className="bg-bg-card rounded-xl p-4 mt-4 border border-[#e8e3d8]">
        <Text className="text-lg font-bold text-primary block mb-3">我的测试记录</Text>
        {history.length === 0 ? (
          <View className="text-center py-6">
            <Text className="text-sm text-[#6a786f] block mb-3">还没有测试记录</Text>
            <View
              className="bg-primary text-white px-4 py-2 rounded-lg inline-block text-sm"
              onClick={handleGoTest}
            >
              <Text>去测试</Text>
            </View>
          </View>
        ) : (
          <>
            <View className="flex justify-between mb-3">
              <Text className="text-xs text-[#6a786f]">共 {history.length} 次</Text>
              <Text className="text-xs text-[#6a786f]">解锁 {Object.keys(stats).length} 种</Text>
            </View>
            {recentHistory.map((item, i) => {
              const lib = TYPE_LIBRARY[item.code]
              const rarity = TYPE_RARITY[item.code]
              const d = new Date(item.time)
              const timeStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
              return (
                <View key={i} className="flex justify-between items-center py-2 border-b border-[#f0ede6]">
                  <View>
                    <Text className="text-sm font-medium text-primary">{item.code} </Text>
                    <Text className="text-xs text-primary-light">{lib?.cn}</Text>
                  </View>
                  <View className="flex items-center gap-2">
                    {rarity && <Text className="text-xs text-accent">{rarity.label}</Text>}
                    <Text className="text-xs text-[#a09a8f]">{timeStr}</Text>
                  </View>
                </View>
              )
            })}
          </>
        )}
      </View>
    </View>
  )
}
