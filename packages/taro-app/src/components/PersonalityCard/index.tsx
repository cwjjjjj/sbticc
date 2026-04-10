import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { TYPE_IMAGES } from '../../constants/personalities'
import { TYPE_RARITY } from '../../constants/rarity'

interface Props {
  code: string
  cn: string
  intro: string
  desc: string
}

export default function PersonalityCard({ code, cn, intro, desc }: Props) {
  const [expanded, setExpanded] = useState(false)
  const rarity = TYPE_RARITY[code]
  const imgSrc = TYPE_IMAGES[code]

  const starStr = rarity
    ? rarity.stars <= 4
      ? '★'.repeat(rarity.stars)
      : rarity.code === 'DRUNK' ? '🍺' : '💎'
    : ''

  return (
    <View className="bg-bg-card rounded-xl p-4 mb-3 border border-[#e8e3d8]">
      {imgSrc && (
        <Image src={imgSrc} className="w-full rounded-lg mb-3" mode="widthFix" style={{ maxHeight: '200px' }} />
      )}
      <View className="flex items-center gap-2 mb-2">
        <Text className="text-lg font-bold text-primary">{code}</Text>
        <Text className="text-sm text-primary-light">{cn}</Text>
      </View>
      {rarity && (
        <View className="px-2 py-1 rounded text-xs mb-2 bg-[#fff8e1] text-accent border border-[#ffe082] inline-block">
          <Text>{starStr} {rarity.label}　{rarity.pct}%</Text>
        </View>
      )}
      <Text className="text-sm text-primary-light block mb-2">{intro}</Text>
      {expanded && (
        <Text className="text-sm text-[#6a786f] leading-relaxed block mb-2">{desc}</Text>
      )}
      <Text
        className="text-sm text-accent"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '收起' : '展开全文'}
      </Text>
    </View>
  )
}
