import Taro from '@tarojs/taro'

const BASE_URL = process.env.TARO_APP_API_BASE || ''

export async function request<T = any>(options: {
  url: string
  method?: 'GET' | 'POST'
  data?: any
}): Promise<T> {
  const { url, method = 'GET', data } = options
  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
    },
  })
  return res.data as T
}
