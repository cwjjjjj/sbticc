import Taro from '@tarojs/taro'

const LOCAL_HISTORY_KEY = 'sbti_history'
const LOCAL_STATS_KEY = 'sbti_local_stats'

interface HistoryItem {
  code: string
  time: number
}

export function saveResult(typeCode: string) {
  try {
    const stats = Taro.getStorageSync(LOCAL_STATS_KEY) || {}
    stats[typeCode] = (stats[typeCode] || 0) + 1
    Taro.setStorageSync(LOCAL_STATS_KEY, stats)
  } catch (e) {}

  try {
    let history: HistoryItem[] = Taro.getStorageSync(LOCAL_HISTORY_KEY) || []
    history.push({ code: typeCode, time: Date.now() })
    if (history.length > 100) history = history.slice(-100)
    Taro.setStorageSync(LOCAL_HISTORY_KEY, history)
  } catch (e) {}
}

export function getLocalStats(): Record<string, number> {
  try { return Taro.getStorageSync(LOCAL_STATS_KEY) || {} }
  catch (e) { return {} }
}

export function getLocalHistory(): HistoryItem[] {
  try { return Taro.getStorageSync(LOCAL_HISTORY_KEY) || [] }
  catch (e) { return [] }
}
