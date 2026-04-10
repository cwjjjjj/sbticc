import { View, Text } from '@tarojs/components'
import { TYPE_LIBRARY } from '../../constants/personalities'
import PersonalityCard from '../../components/PersonalityCard'

export default function ProfilesPage() {
  return (
    <View className="min-h-screen bg-bg px-4 py-4 pb-20">
      <Text className="text-xl font-bold text-primary text-center block mb-4">全部人格介绍</Text>
      {Object.values(TYPE_LIBRARY).map(t => (
        <PersonalityCard key={t.code} code={t.code} cn={t.cn} intro={t.intro} desc={t.desc} />
      ))}
    </View>
  )
}
