export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profiles/index',
    'pages/compat/index',
    'pages/ranking/index',
    'pages/test/index',
    'pages/result/index',
  ],
  tabBar: {
    color: '#6a786f',
    selectedColor: '#304034',
    backgroundColor: '#fffdf7',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/home/index', text: '首页' },
      { pagePath: 'pages/profiles/index', text: '人格' },
      { pagePath: 'pages/compat/index', text: '相性' },
      { pagePath: 'pages/ranking/index', text: '排行' },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fffdf7',
    navigationBarTitleText: 'SBTI 人格测试',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f0e8',
  },
})
