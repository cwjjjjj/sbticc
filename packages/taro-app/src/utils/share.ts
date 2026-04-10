import Taro from '@tarojs/taro'

export function saveImageToAlbum(tempFilePath: string) {
  if (process.env.TARO_ENV === 'weapp') {
    Taro.saveImageToPhotosAlbum({ filePath: tempFilePath })
      .then(() => Taro.showToast({ title: '已保存到相册', icon: 'success' }))
      .catch(() => Taro.showToast({ title: '保存失败', icon: 'none' }))
  }
}
