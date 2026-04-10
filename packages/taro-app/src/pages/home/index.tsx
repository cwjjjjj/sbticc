import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TYPE_LIBRARY } from '../../constants/personalities'
import PersonalityCard from '../../components/PersonalityCard'

export default function Home() {
  const handleStart = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  return (
    <View className="min-h-screen bg-bg px-4 pb-20">
      {/* Hero */}
      <View className="bg-bg-card rounded-xl p-6 mt-4 text-center border border-[#e8e3d8]">
        <Text className="text-2xl font-bold text-primary block mb-4">
          MBTI已经过时，SBTI来了。
        </Text>
        <View
          className="bg-primary text-white px-6 py-3 rounded-lg inline-block text-base font-medium"
          onClick={handleStart}
        >
          开始测试
        </View>
      </View>

      {/* 人格一览 */}
      <View className="mt-4">
        <Text className="text-xl font-bold text-primary text-center block mb-4">
          全部人格一览
        </Text>
        {Object.values(TYPE_LIBRARY).map(t => (
          <PersonalityCard key={t.code} code={t.code} cn={t.cn} intro={t.intro} desc={t.desc} />
        ))}
      </View>
    </View>
  )
}
