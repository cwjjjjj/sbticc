import { View, Text } from '@tarojs/components'
import { COMPATIBILITY } from '../../constants/compatibility'

const typeIcons = { soulmate: '💕', rival: '⚔️' }
const typeLabels = { soulmate: '天生一对', rival: '欢喜冤家' }

export default function CompatPage() {
  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      <Text className="text-xl font-bold text-primary text-center block mb-4">人格相性表</Text>
      {Object.entries(COMPATIBILITY).map(([key, c]) => {
        const [codeA, codeB] = key.split('+')
        return (
          <View key={key} className="bg-bg-card rounded-xl p-4 mb-3 border border-[#e8e3d8]">
            <View className="flex items-center justify-center gap-2 mb-2">
              <Text className="text-sm font-bold text-primary">{codeA}</Text>
              <Text className="text-xs text-[#a09a8f]">×</Text>
              <Text className="text-sm font-bold text-primary">{codeB}</Text>
            </View>
            <View className={`${c.type === 'soulmate' ? 'bg-[#fce4ec]' : 'bg-[#fff8e1]'} px-2 py-1 rounded text-center mb-2`}>
              <Text className="text-xs">{typeIcons[c.type]} {typeLabels[c.type]}</Text>
            </View>
            <Text className="text-xs text-[#6a786f] text-center block">{c.say}</Text>
          </View>
        )
      })}
    </View>
  )
}
